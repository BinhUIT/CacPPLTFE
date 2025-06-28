const beEndpont ="http://localhost:8080/";
const token = localStorage.getItem("token");
let listTask=[];
let completedTask=0;
let workTime=0;
const statisticData=[];
let listSession=[];
let listCompletTask=[];
function getDateInWeek(today) {
    
  const result = [];

  const currentDay = today.getDay(); // CN = 0, T2 = 1, ..., T7 = 6
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDay); // lùi về Chủ nhật

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    result.push(date);
  }

  return result;

}
function calculateStatisticData() {
    const dateInWeek = getDateInWeek(new Date());
    for(let i=0;i<7;i++) {
        statisticData.push(0);
        listCompletTask.push(0);
    }
    for(let i=0;i<7;i++) {
        for(let j=0;j<listSession.length;j++) {
            const dateString = listSession[j].startTime.replace(" ","T");
            const sessionStartDate = new Date(dateString);
            if(isInDate(sessionStartDate,dateInWeek[i])) {
                const endDateString = listSession[j].endTime.replace(" ","T");
                const sessionEndDate = new Date(endDateString);
                statisticData[i]= sessionEndDate-sessionStartDate;
            }
        }
        for(let j=0;j<listTask.length;j++){
            if(listTask[j].completeTime==null||listTask[j].completeTime==undefined) {
                continue;
            }
            const completeDateString = listTask[j].completeTime.replace(" ","T");
            const taskCompeteDate = new Date(completeDateString);
            if(isInDate(dateInWeek[i],taskCompeteDate)) {
                listCompletTask[i]++;
            }
        }
    }

}
function isInDate(date1, date2) {
    if(date1.getDate()!=date2.getDate()) {
        return false;
    } 
    if(date1.getMonth()!=date2.getMonth()) {
        return false;
    } 
    if(date1.getFullYear()!=date2.getFullYear()){
        return false;
    }
    return true;
}
async function getAllTask() {
    const response = await fetch(beEndpont+"all_task",{
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    });
    if(response.ok) {
        listTask= await response.json();
        console.log(listTask);
    }

}
async function getWorkTime() {
    const response = await fetch(beEndpont+"work_time",{
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    });
    if(response.ok) {
        workTime= await response.json();
    }
}
async function getSessionInWeek() {
    const response = await fetch(beEndpont+"session_in_week",{
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    });
    if(response.ok) {
        const responseData = await response.json();
        listSession=responseData;
    }
}
async function displayToUI() {
    await getAllTask();
    await getWorkTime();
    await getSessionInWeek();
    for(let i=0;i<listTask.length;i++) {
        if(listTask[i].currentProgress>=1) {
            completedTask++;
        }
    }
    const workHours = Math.floor(workTime/3600000);
    document.getElementById("completedTask").innerHTML= completedTask;
    document.getElementById("work-time").innerHTML=workHours;
    document.getElementById("average-complete-time").innerHTML=workHours/completedTask;
    calculateStatisticData();
    for(let i=0;i<statisticData.length;i++) {
        console.log(statisticData[i]);
    } 
    const ctx = document.getElementById('workChart').getContext('2d');

    const fakeData = statisticData.map((item)=>{
         return (item/3600000).toFixed(2);
    })

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Work Hours',
          data: fakeData,
          backgroundColor: '#3498db',
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }); 
     const taskChart = document.getElementById('complete-task-statistic').getContext('2d');
     const taskChartUI = new Chart(taskChart, {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Completed task',
          data: listCompletTask,
          backgroundColor: '#3498db',
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tasks'
            },
           
      ticks: {
       stepSize:1,
        callback: function(value) {
          return Math.round(value);
        }
      },
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }); 
}
displayToUI();
function setUpForGenerateReport() {
  document.getElementById("generate_report").addEventListener("click",function(e) {
    e.preventDefault();
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    if(!start) {
      alert("Please select start time");
      return;
    } 
    if(!end) {
      alert("Please select end time");
      return;
    } 
    const startDate = new Date(start+"T00:00:00");
    const endDate = new Date(end+"T23:59:59.999");
    if(endDate.getDay()<startDate.getDay()||endDate.getMonth()<startDate.getMonth()||endDate.getFullYear()<startDate.getFullYear()) {
      alert("Please select end date after start date");
      return;
    }
    sendReportRequest(startDate.toISOString(), endDate.toISOString());
    
  })
}
async function sendReportRequest(startDate, endDate) {
  const request = {
    start:startDate,
    end:endDate
  }
  const response = await fetch(beEndpont+"get_completed_task", {
    method:"POST",
    headers:{
      "Content-type":"application/json",
      "Authorization":"Bearer "+token
    },
    body:JSON.stringify(request)
  });
  if(response.ok) {
    const responseData = await response.json();
    console.log(responseData);
    const exportData = responseData.map((item,index)=>{
      return {
        Index:index+1,
        Name:item.name,
        Description:item.description,
        Start:formatDateTime(item.startTime),
        End:formatDateTime(item.endTime),
        Complete:formatDateTime(item.completeTime)
      }
    });
    exportToExcel(exportData);
  }
} 
function formatDateTime(isoString) {
    const date = new Date(isoString);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
} 
function exportToExcel(data, fileName = "report.xlsx") {
   
    const worksheet = XLSX.utils.json_to_sheet(data);

    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

   
    XLSX.writeFile(workbook, fileName);
} 
document.getElementById("logoutbutton").addEventListener("click",e=>{
    e.preventDefault();
    document.getElementById("logoutPopup").style.display="flex";
});
function logout(){
    localStorage.clear();
    window.location.href="/index.html";
}
function doNotLogout() {
    document.getElementById("logoutPopup").style.display="none";
}
setUpForGenerateReport();