var PEEPWIDTH = 21;
var PEEPHEIGHT = 32;
 
var imagesA = [{path:"prototype_A_1.png",valids:[[33,99],[33,132],[36,167],[28,202],[40,231],[31,266]]},
                                                  {path:"prototype_A_2.png",valids:[[33,99],[29,133],[30,167],[39,202],[31,225],[31,266]]},
                                                  {path:"prototype_A_3.png",valids:[[38,99],[41,133],[26,167],[26,202],[42,234],[29,267]]},
                                                  {path:"prototype_A_4.png",valids:[[28,102],[39,129],[40,171],[26,202],[31,236],[34,267]]},
                                                 
                                                  {path:"prototype_A2_1.png",valids:[[111,99],[124,130],[122,165],[115,199],[123,237],[110,266]]},
                                                  {path:"prototype_A2_2.png",valids:[[112,99],[121,132],[125,164],[113,197],[111,231],[123,265]]},
                                                  {path:"prototype_A2_3.png",valids:[[121,98],[121,132],[113,163],[113,197],[111,231],[123,265]]},
                                                  {path:"prototype_A2_4.png",valids:[[115,100],[112,133],[124,163],[114,199],[123,233],[119,268]]},
                                                 
                                                  {path:"prototype_A3_1.png",valids:[[197,103],[210,133],[209,168],[201,202],[209,241],[196,269]]},
                                                  {path:"prototype_A3_2.png",valids:[[207,100],[201,132],[208,167],[209,204],[210,238],[198,271]]},
                                                  {path:"prototype_A3_3.png",valids:[[200,100],[210,134],[200,169],[210,199],[200,234],[207,267]]},
                                                  {path:"prototype_A3_4.png",valids:[[200,99],[200,130],[200,169],[197,199],[200,234],[213,266]]},
                                                 
                                                  {path:"prototype_A4_1.png",valids:[[293,99],[288,132],[293,166],[285,201],[297,230],[288,265]]},
                                                  {path:"prototype_A4_2.png",valids:[[285,102],[291,135],[285,169],[293,202],[284,239],[297,271]]},
                                                  {path:"prototype_A4_3.png",valids:[[293,103],[296,135],[290,170],[284,202],[292,241],[282,272]]},
                                                  {path:"prototype_A4_4.png",valids:[[285,102],[298,135],[284,170],[297,202],[285,239],[295,272]]}];
                                               
var imagesB = [{path:"prototype_A_1.png",valids:[[33,99],[33,132],[36,167],[28,202],[40,231],[31,266]]},
                                                  {path:"prototype_B_1.png",valids:[[119,100],[123,138],[109,169],[112,205],[114,237],[124,268]]},
                                                  {path:"prototype_B_2.png",valids:[[210,103],[198,137],[211,166],[197,197],[212,232],[195,266]]},
                                                  {path:"prototype_B_3.png",valids:[[299,101],[280,136],[284,168],[297,205],[288,238],[292,273]]}];
 
var plans = [imagesA, imagesB];
var currPlan = 0;
var currImage = 0;
 
 
function FindPosition(oElement)
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}
function GetCoordinates(e)
{
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(mockupImage);
  if (!e) var e = window.event;
  if (e.pageX || e.pageY)
  {
    PosX = e.pageX;
    PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
    {
      PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];
 
//  document.getElementById("x").innerHTML = PosX;
//  document.getElementById("y").innerHTML = PosY;
 
  return [PosX,PosY];
}
 
function CheckCoordinates(e)
{
                var posns = GetCoordinates(e);
                var PosX = posns[0];
                var PosY = posns[1];
               
                var i;
                for (i = 0; i < plans[currPlan][currImage].valids.length; i++) {  // loop through all peeps in the image
                                var coordinates = plans[currPlan][currImage].valids[i];
                                if (coordinates[0] <= PosX && PosX <= (coordinates[0] + PEEPWIDTH) && coordinates[1] <= PosY && PosY <= (coordinates[1]+PEEPHEIGHT)) {  // Is coordinate within box of peep being checked?
                                                addPeep((currPlan==0) ? Math.floor(currImage/4) : currImage % 4);
                                                currImage++;
                                                if (currImage >= plans[currPlan].length) {
                                                                currImage -= plans[currPlan].length;
                                                }
                                                document.getElementById("mockupImage").src="../images/"+plans[currPlan][currImage].path;
 
                                                return true;
                                }
                }
                return false;
}
 
function resetPlan() {
                currImage = 0;
                document.getElementById("mockupImage").src="../images/"+plans[currPlan][currImage].path;
}
 
function changePlan(planNumber)
{
                if (currPlan == planNumber) {
                                return false;
                }
               
                if (planNumber >= plans.length) {
                                alert("Invalid Plan, or plan not yet implemented");
                                return false;
                }
               
                var isConfirmed = confirm("Are you sure? This will clear all data you have collected so far.");
                if (isConfirmed) {
                                currPlan = planNumber;
                                resetPlan();
                                clearData();
                }
                return isConfirmed;
}