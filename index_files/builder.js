var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
function generate_url(){
	var str = '';
	
	// get attributes values
	array = document.getElementsByClassName("attribute");
	for (var i = 0; i < array.length; i++) {
		str += array[i].value + "-";	  
	}  
	str += document.getElementById('attribute_points_remaining').innerHTML + "-";	
	
	// get passive skills values
	array = document.querySelectorAll("input[class=skill_button]");
	for (var i = 0; i < array.length; i++) {
		str += array[i].value + "-";
	} 
	
	// reload page with long url
	window.location.href = 'https://web.archive.org/web/20230115141808/https://www.gloriavictisgame.info/builder?long_url=' + str.slice(0, -1); 
	
}

function Check_Top_Skills(){
	array = document.querySelectorAll("input[class=skill_button]");
	topskills = [];
	for (var i = 0; i < array.length; i++) {
		if ($('#' + array[i].id).data('parents') === ''){topskills.push(array[i].id);}
	}	
}

function reset_all(){
	window.location.href = 'https://web.archive.org/web/20230115141808/https://www.gloriavictisgame.info/builder'; 
}


function reset_passives(){

	// List all skill buttons
	array = document.querySelectorAll("input[class=skill_button]");
	for (var i = 0; i < array.length; i++) {
		LockSkill(array[i].id); // Deactivate all skills
	}
	
	// Activate first skills row
	UnlockSkill('skill__first_aid');
	UnlockSkill('skill__reaper');
	UnlockSkill('skill__bleeding');
	UnlockSkill('skill__shield_bash');
	UnlockSkill('skill__bound'); // un-comment for horses
	
	Check_Top_Skills();
	CountPoints();
	SetColors();
}

// Calculate total attribute points spent (must be defined before reset_attributes)
function CalculateAttributePoints() {
	var str = parseFloat(document.getElementById('strength').value) || 80;
	var con = parseFloat(document.getElementById('constitution').value) || 80;
	var dex = parseFloat(document.getElementById('dexterity').value) || 80;
	
	var totalPoints = 0;
	
	// Helper function to calculate points for a single attribute
	function getPointsForAttribute(value) {
		if (value <= 80) return 0;
		if (value <= 150) return value - 80; // 1 point per attribute point (80-150)
		if (value <= 200) return 70 + (value - 150) * 2; // 70 points for 80-150, then 2 points per (150-200)
		return 70 + 100 + (value - 200) * 3; // 70 + 100 for 80-200, then 3 points per (200+)
	}
	
	totalPoints += getPointsForAttribute(str);
	totalPoints += getPointsForAttribute(con);
	totalPoints += getPointsForAttribute(dex);
	
	return totalPoints;
}

function reset_attributes(){
	 array = document.getElementsByClassName("attribute");
		for (var i = 0; i < array.length; i++) {
		  array[i].value = 80;
		  
		}  
		// Recalculate points after reset
		var totalPoints = CalculateAttributePoints();
		document.getElementById('attribute_points_remaining').innerHTML = 535 - totalPoints;
		document.getElementById('attribute_points').innerHTML = totalPoints;

	Update_Statistics();
}


function CountPoints() {
	array = document.querySelectorAll("input[class=skill_button]");
	var total = 0;
	for (var i = 0; i < array.length; i++) {
		total += +array[i].value;  	
		//if (array[i].value === 0 && !document.getElementById(array[i].id).disabled){document.getElementById('count_text__' + array[i].id).style.color = 'white';}
		//if (array[i].value >= 1){document.getElementById('count_text__' + array[i].id).style.color = 'yellow';}
		//if (array[i].value === document.getElementById(array[i].id).max){document.getElementById('count_text__' + array[i].id).style.color = 'green';}
	}	
	document.getElementById("points_spent").innerHTML  = 'Progress Points : ' + (100-total);
	return total;
}

function SetColors(){
	array = document.querySelectorAll("input[class=skill_button]");
	for (var i = 0; i < array.length; i++) {
		if (array[i].value == 0){document.getElementById('count_text__' + array[i].id).style.color = 'white';}
		if (array[i].value >= 1){document.getElementById('count_text__' + array[i].id).style.color = '#ebb514';}
		if (array[i].value === document.getElementById(array[i].id).max){document.getElementById('count_text__' + array[i].id).style.color = '#40ec06';}
	}		
}


function CheckAll(){
	array = document.querySelectorAll("input[class=skill_button]");	
	for (var i = array.length-1; i >= 0; i--) {	  
	 LoopParents(array[i].id);	
	}
}


function CheckIfValid(skill){
	var isValid = false;
	var children = [];
	array = document.querySelectorAll("input[class=skill_button]");
		for (var i = 0; i < array.length; i++) { // build child array
			var dd = $('#' + array[i].id).data('parents');
			if (dd.match(skill)) {children.push(array[i].id);}
		}				
		for (var i = 0; i < children.length; i++) { // then check every child
			if (document.getElementById(children[i]).value >= 5){isValid = true;};
		}		
		return isValid; // return true or false
}


function LoopParents(skill){	
	if ($('#' + skill).data('parents') !== ''){ // if skill has parents
		let parents = $('#' + skill).data('parents').split(','); // split on comma		
		if (document.getElementById(skill).value >= 5){			  
			if (parents !== ''){
				for (let node in parents) {
					UnlockSkill(parents[node]);
					//console.log('unlocked : ' + parents[node]);
				}
			}
		} else {
			if (parents !== ''){
				for (let node in parents) {
					if (CheckIfValid(parents[node]) === false){
						LockSkill(parents[node]);
						//console.log('lock : ' + parents[node]);
					}
					
				}
			}		
		}
	}
}

function UnlockSkill(skill){
	$('#' + skill).prop('disabled', false);
	
		document.getElementById('count_text__' + skill).style.color = 'white';	
		
		document.getElementById(skill).style.opacity=1;  
	document.getElementById('count_text__' + skill).style.opacity=1; 
	var icon = document.getElementById(skill).style.backgroundImage.replace("_d.png", ".png");
	document.getElementById(skill).style.backgroundImage = icon;
	
}

function LockSkill(skill){
	$('#' + skill).prop('disabled', true);
	//document.getElementById('count_text__' + skill).style.color = '#595959';	
			//document.getElementById('count_text__' + skill).style.color = 'white';	

	document.getElementById(skill).value = 0;	
	document.getElementById('count_text__' + skill).innerHTML = '0/' + document.getElementById(skill).max;
	
	document.getElementById(skill).style.opacity=0.3;  
	document.getElementById('count_text__' + skill).style.opacity=0.1;  
	var icon = document.getElementById(skill).style.backgroundImage;
	
	if (!icon.match("_d.png")){
		document.getElementById(skill).style.backgroundImage = icon.replace(".png", "_d.png");
	}
	
	
}

function HasTopSkill(){
	t = false;
	for (var i = 0; i < topskills.length; i++) { // then check every child
			if (document.getElementById(topskills[i]).value >= 5){t = true;};
		}	
	return t;
}


}
/*
     FILE ARCHIVED ON 14:18:08 Jan 15, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:13:37 Dec 17, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.569
  exclusion.robots: 0.019
  exclusion.robots.policy: 0.009
  esindex: 0.012
  cdx.remote: 14.848
  LoadShardBlock: 905.786 (3)
  PetaboxLoader3.datanode: 937.813 (5)
  load_resource: 104.486
  PetaboxLoader3.resolve: 43.532
  loaddict: 42.922
*/