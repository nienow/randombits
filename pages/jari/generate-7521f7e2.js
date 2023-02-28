var y=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],h=["January","February","March","April","May","June","July","August","September","October","November","December"];const e=new URLSearchParams(window.location.search),r=new Date(`${e.get("startDate")}T00:00:00`),D=new Date(`${e.get("endDate")}T00:00:00`),c=Number(e.get("startTime")),d=Number(e.get("endTime")),u=Number(e.get("lines")||2),T=Math.round((D.getTime()-r.getTime())/864e5),$=d-c,b=$*u,p=8.5/b,o=`<div class="line" style="height: ${p}in"></div>`;let l="";for(let s=0;s<T+1;s++){const n=new Date(r.getTime()+864e5*s),m=`<div class="title">${y[n.getDay()]}, ${h[n.getMonth()]} ${n.getDate()}</div>`,a=[];for(let t=c;t<d;t++){const v=t===12?12:t%12;a.push(`<div class="hour">
            <div class="time">${v}</div>
            ${o}
        </div>`);for(let i=1;i<u;i++)a.push(`<div class="hour">
                <div class="time"></div>
                ${o}
            </div>`)}const g=`<div class="page">${m}${a.join("")}</div>`;l+=g}document.getElementById("output").innerHTML=l;
