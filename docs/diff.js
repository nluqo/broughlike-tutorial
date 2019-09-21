//hardcoded contents
content.NEWLINE = "\n\n";

Object.keys(content).forEach(k => {
	document.querySelectorAll("#content"+k).forEach(contentContainer => {
		if(contentContainer){
			contentContainer.textContent = content[k];
		}else{
			console.log("MISSING CONTAINER FOR #content"+k);
		}
	});
});

hljs.initHighlightingOnLoad();

document.querySelectorAll("pre code").forEach(n => {
	let lines = n.innerHTML.split("\n");
	let prefixChar = ''
	prefixChar += '<span class="diff">';
	if(n.classList.contains('add')){
		prefixChar += '<span class="noselect">&nbsp;+&nbsp;</span>';
	}else if(n.classList.contains('remove')){
		prefixChar += '<span class="noselect">&nbsp;-&nbsp;</span>';
	}else{
		prefixChar += '<span class="noselect">&nbsp;&nbsp;&nbsp;</span>';
	}
	prefixChar += '</span>';
	if(lines.length){
		let lineHtml = lines[0];
		//ignore first and last lines
		for(let i=1;i<lines.length-1;i++){
			lineHtml += "\n";
			lineHtml += prefixChar;
			lineHtml += lines[i] ;
		}
		n.innerHTML = lineHtml;
	}
});
