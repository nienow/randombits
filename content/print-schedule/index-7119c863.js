function a(t){t.preventDefault();const n=new FormData(document.forms.generate),o=new URLSearchParams(n).toString();document.getElementById("output").src="generate.html?"+o,document.getElementById("printBtn").style.visibility="visible"}function r(t){t.preventDefault(),document.getElementById("output").contentWindow.print()}function i(){const t=document.forms.generate,n=t.startDate,o=t.endDate,e=new Date(new Date().toDateString());n.valueAsDate=e,e.setMonth(e.getMonth()+3),o.valueAsDate=e,document.getElementById("previewBtn").addEventListener("click",a),document.getElementById("printBtn").addEventListener("click",r)}i();
