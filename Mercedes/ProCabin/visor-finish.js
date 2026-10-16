// A locally retouched slim acrylic visor, rendered in the original photo space.
let visorFinishTicket = 0;
const SIMPLE_ACRYLIC_VISOR = new URL("visor-simple-acrylic.png", document.currentScript.src).href;

async function updateFactoryVisorFinish() {
  const ticket = ++visorFinishTicket;
  const truck = document.getElementById("truck");
  let canvas = document.getElementById("factoryVisorFinish");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "factoryVisorFinish";
    canvas.width = 1584; canvas.height = 993;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1";
    truck.after(canvas);
  }
  try {
    const [image, acrylic, silver] = await Promise.all([
      imgLoad(truck.getAttribute("src")), imgLoad(SIMPLE_ACRYLIC_VISOR), imgLoad(FILES.truck.srebrny)
    ]);
    if (ticket !== visorFinishTicket) return;
    const patch = document.createElement("canvas"); patch.width = 860; patch.height = 300;
    const paint = patch.getContext("2d", { willReadFrequently: true });
    paint.drawImage(acrylic,0,0,860,300);
    const sample = document.createElement("canvas"); sample.width=sample.height=1;
    const sampler=sample.getContext("2d",{willReadFrequently:true});
    const colorAt=source=>{
      sampler.clearRect(0,0,1,1);
      sampler.drawImage(source,700/1584*source.naturalWidth,145/993*source.naturalHeight,
        source.naturalWidth/1584,source.naturalHeight/993,0,0,1,1);
      return sampler.getImageData(0,0,1,1).data;
    };
    const target=colorAt(image),reference=colorAt(silver);
    const pixels=paint.getImageData(0,0,860,300);
    for(let i=0;i<pixels.data.length;i+=4){
      const pixel=i/4,x=430+(pixel%860)/2,y=140+Math.floor(pixel/860)/2;
      // Paint above the acrylic follows the selected cab color; the smoke
      // acrylic and restored windshield retain their neutral glass material.
      const edgeY=202-(x-463)*.078;
      const weight=Math.max(0,Math.min(1,(edgeY-y)/2));
      for(let c=0;c<3;c++)pixels.data[i+c]*=1+weight*(target[c]/Math.max(1,reference[c])-1);
    }
    paint.putImageData(pixels,0,0);
    paint.globalCompositeOperation="destination-in";
    paint.setTransform(2,0,0,2,-430*2,-140*2);
    paint.beginPath();
    paint.moveTo(452,198);
    paint.lineTo(524,184); paint.lineTo(526,174); paint.lineTo(553,175);
    paint.lineTo(633,170); paint.lineTo(638,158); paint.lineTo(665,161);
    paint.lineTo(727,160); paint.lineTo(738,148); paint.lineTo(799,146);
    paint.lineTo(824,163); paint.lineTo(832,183);
    paint.quadraticCurveTo(835,215,819,231);
    paint.quadraticCurveTo(651,252,487,269);
    paint.quadraticCurveTo(472,269,465,247);
    paint.quadraticCurveTo(453,226,452,198); paint.closePath();
    paint.filter="blur(1.2px)"; paint.fill();
    const context=canvas.getContext("2d");
    context.clearRect(0,0,1584,993);
    context.drawImage(patch,430,140,430,150);
    setImageError("visorFinish");
  } catch {
    if(ticket===visorFinishTicket)setImageError("visorFinish","Nie udało się wczytać akrylowej osłony przeciwsłonecznej.");
  }
}