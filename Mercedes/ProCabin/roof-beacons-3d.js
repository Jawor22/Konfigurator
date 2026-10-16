/* Solid, lit geometry. The mount is the local origin; camera controls rotate vertices,
   never a flattened picture. Transparent lens faces surround a separate LED core. */
class RoofBeaconModel3D {
  constructor(clear = false, orangeLens = false, tall = false, minor = false, bee = false) {
    this.clear = clear && !orangeLens;
    this.variant = clear ? (orangeLens ? 'skyled-orange' : 'skyled-clear') : 'amber';
    this.faces = [];
    if (bee) {
      this.clear=false;this.variant='skyled-bee';
      // 122 mm wide / 82.4 mm high, three amber bands with black separators.
      this.lathe([[0,0],[0,.365],[-.03,.365],[-.12,.31],[-.14,.29],[-.14,0]],'base');
      this.lathe([[-.13,0],[-.13,.24],[-.46,.24],[-.47,0]],'core');
      for(let row=0;row<3;row++) {
        const y=-.15-row*.11;
        this.lathe([[y,.289],[y-.075,.289]],'glass');
        for(let i=0;i<16;i++) {
          const a=i*Math.PI/8,b=a+.23;
          const v=(t,h)=>[.255*Math.cos(t),h,.255*Math.sin(t)];
          this.faces.push({vertices:[v(a,y-.01),v(b,y-.01),v(b,y-.065),v(a,y-.065)],material:'led'});
        }
        if(row<2)this.lathe([[y-.075,0],[y-.075,.291],[y-.11,.291],[y-.11,0]],'base');
        for(let i=0;i<64;i++) {
          const a=i*Math.PI/32,b=a+.012;
          const v=(t,h)=>[.290*Math.cos(t),h,.290*Math.sin(t)];
          this.faces.push({vertices:[v(a,y),v(b,y),v(b,y-.075),v(a,y-.075)],material:'rib'});
        }
      }
      this.lathe([[-.445,0],[-.445,.29],[-.477,.29],[-.493,.26],[-.493,0]],'base');
      return;
    }
    if (minor) {
      this.clear=false;this.variant='skyled-minor';
      // Compact 133 mm diameter, 50.5 mm high, with an opaque black top cover.
      this.lathe([[0,0],[0,.398],[-.035,.398],[-.10,.35],[-.11,0]],'base');
      this.lathe([[-.10,0],[-.10,.29],[-.25,.29],[-.25,0]],'core');
      for(let i=0;i<20;i++) {
        const a=i*Math.PI/10,b=a+.18;
        const v=(t,y)=>[.305*Math.cos(t),y,.305*Math.sin(t)];
        this.faces.push({vertices:[v(a,-.12),v(b,-.12),v(b,-.24),v(a,-.24)],material:'led'});
      }
      this.lathe([[-.10,.337],[-.13,.34],[-.25,.34],[-.26,.33]],'glass');
      for(let i=0;i<64;i++) {
        const a=i*Math.PI/32,b=a+.012;
        const v=(t,y)=>[.341*Math.cos(t),y,.341*Math.sin(t)];
        this.faces.push({vertices:[v(a,-.12),v(b,-.12),v(b,-.245),v(a,-.245)],material:'rib'});
      }
      this.lathe([[-.25,0],[-.25,.35],[-.285,.355],[-.33,.33],[-.33,0]],'cap');
      return;
    }
    if (tall) {
      this.variant=orangeLens?'skyled-127-orange':'skyled-127-clear';
      // Same mount origin; 165/167 diameter and 127/167 total height.
      this.lathe([[0,0],[0,.494],[-.04,.494],[-.18,.46],[-.22,.41],[-.22,0]],'base');
      this.lathe([[-.22,0],[-.22,.28],[-.67,.28],[-.69,0]],'core');
      for(let row=0;row<4;row++)for(let i=0;i<10;i++) {
        const a=i*Math.PI/5,b=a+.30,y=-.29-row*.09;
        const v=(t,h)=>[.30*Math.cos(t),h,.30*Math.sin(t)];
        this.faces.push({vertices:[v(a,y),v(b,y),v(b,y-.06),v(a,y-.06)],material:'led'});
      }
      this.lathe([[-.21,.415],[-.24,.42],[-.68,.42],[-.735,.41],[-.76,.38],[-.76,0]],'glass');
      // Narrow vertical prism ridges match the cylindrical product lens.
      for(let i=0;i<64;i++) {
        const a=i*Math.PI/32,b=a+.012;
        const v=(t,y)=>[.422*Math.cos(t),y,.422*Math.sin(t)];
        this.faces.push({vertices:[v(a,-.25),v(b,-.25),v(b,-.70),v(a,-.70)],material:'rib'});
      }
      // Shorten only the lens assembly by 10%, anchored at its seat on the base.
      for (const face of this.faces) {
        if (face.material === 'base') continue;
        face.vertices = face.vertices.map(([x,y,z]) => [x,-.21+(y+.21)*.9,z]);
      }
      return;
    }
    if (clear) {
      // 89 mm high / 167 mm diameter: low clear dome on a solid black mounting base.
      this.lathe([[0,0],[0,.48],[-.025,.50],[-.10,.50],[-.15,.46],[-.15,0]], 'base');
      this.lathe([[-.15,0],[-.15,.34],[-.36,.34],[-.39,0]], 'core');
      for (let i=0;i<12;i++) {
        const a=i*Math.PI/6,b=a+.24;
        const v=(t,y)=>[.365*Math.cos(t),y,.365*Math.sin(t)];
        this.faces.push({vertices:[v(a,-.22),v(b,-.22),v(b,-.36),v(a,-.36)],material:'led'});
      }
      this.lathe([[-.14,.46],[-.19,.465],[-.38,.455],[-.46,.425],[-.50,.35],[-.53,.18],[-.533,0]],'glass');
      for (const y of [-.20,-.28,-.36]) this.lathe([[y,.461],[y-.006,.466],[y-.012,.459]],'rib');
      return;
    }
    this.lathe([[0,0],[0,.46],[-.025,.50],[-.10,.50],[-.135,.46],[-.145,0]], 'base');
    this.lathe([[-.14,0],[-.14,.20],[-.56,.20],[-.59,0]], 'core');
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, b = a + .30;
      const v = (t,y) => [.215*Math.cos(t),y,.215*Math.sin(t)];
      this.faces.push({vertices:[v(a,-.25),v(b,-.25),v(b,-.49),v(a,-.49)],material:'led'});
    }
    const lens = [[-.14,.455],[-.18,.46],[-.27,.46],[-.36,.46],[-.45,.455],[-.54,.45],[-.63,.43],[-.70,.37],[-.75,.25],[-.77,0]];
    this.lathe(lens,'glass');
    for (const y of [-.19,-.27,-.35,-.43,-.51])
      this.lathe([[y,.458],[y-.009,.465],[y-.018,.457]],'rib');
  }
  lathe(profile, material) {
    const point = ([y,r],a) => [r*Math.cos(a),y,r*Math.sin(a)];
    for(let j=0;j<profile.length-1;j++) {
      if(profile[j][1]===0 || profile[j+1][1]===0) {
        const bottom=profile[j][1]===0;
        const section=profile[bottom ? j+1 : j];
        const vertices=Array.from({length:64},(_,i)=>point(section,i*Math.PI/32));
        if(bottom)vertices.reverse();
        this.faces.push({vertices,material});
        continue;
      }
      for(let i=0;i<64;i++) {
      const a=i*Math.PI/32,b=(i+1)*Math.PI/32;
      const ring = [point(profile[j],a),point(profile[j],b),point(profile[j+1],b),point(profile[j+1],a)];
      // At the axis a quad collapses to a triangle. Remove the repeated center
      // before calculating its normal, otherwise the opaque bottom is culled.
      const vertices = ring.filter((v,index) => {
        const previous = ring[(index + ring.length - 1) % ring.length];
        return Math.hypot(...v.map((value,axis) => value - previous[axis])) > 1e-9;
      });
      if (vertices.length >= 3) this.faces.push({vertices,material});
      }
    }
  }
  draw(canvas,p,displayWidth,emissive=false) {
    const resolution = Math.min(2,window.devicePixelRatio||1);
    const width=Math.max(1,Math.round(displayWidth*resolution)),height=Math.round(width*993/1584);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    const ctx=canvas.getContext('2d');
    ctx.setTransform(width/1584,0,0,height/993,0,0);ctx.clearRect(0,0,1584,993);
    ctx.save();
    // The photograph contains an opaque studio background, so placing this canvas
    // below it would hide the entire beacon. Clip against the actual roof silhouette
    // instead: both the housing and its flashing pass disappear behind the cab.
    const roofEdge=[[1584,76],[900,76],[890,76],[880,76.5],[870,77.5],[860,78],
      [850,79.5],[840,81],[700,97],[600,109],[540,117],[530,118.5],
      [520,122.5],[510,123],[500,128],[490,134.5],[480,141],[0,141]];
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(1584,0);
    for(const [x,y] of roofEdge)ctx.lineTo(x,y);
    ctx.closePath();ctx.clip();
    const pitch=(p.pitch+16)*Math.PI/180,yaw=p.yaw*Math.PI/180,roll=p.angle*Math.PI/180;
    const rotate=([x,y,z])=>{
      const yy=y*Math.cos(pitch)-z*Math.sin(pitch),zz=y*Math.sin(pitch)+z*Math.cos(pitch);
      const xx=x*Math.cos(yaw)+zz*Math.sin(yaw),zzz=-x*Math.sin(yaw)+zz*Math.cos(yaw);
      return [xx*Math.cos(roll)-yy*Math.sin(roll),xx*Math.sin(roll)+yy*Math.cos(roll),zzz];
    };
    const faces=this.faces.map(face=>{
      const vertices=face.vertices.map(([x,y,z])=>rotate([x*p.size*p.width/100,y*p.size*p.height/100,z*p.size*p.width/100]));
      const a=vertices[1].map((v,i)=>v-vertices[0][i]),b=vertices[2].map((v,i)=>v-vertices[0][i]);
      let n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
      const length=Math.hypot(...n)||1;n=n.map(v=>v/length);
      return {...face,vertices,n,z:vertices.reduce((s,v)=>s+v[2],0)/vertices.length};
    }).sort((a,b)=>a.z-b.z);
    for(const face of faces){
      const {n,material}=face,glass=material==='glass'||material==='rib';
      if(emissive && (!glass || n[2]<=0))continue;
      if(!glass&&material!=='cap'&&n[2]<=0)continue;
      const light=Math.max(0,-.38*n[0]-.65*n[1]+.66*n[2]);
      const highlight=Math.pow(Math.max(0,-.42*n[0]-.24*n[1]+.875*n[2]),28);
      let color;
      if(material==='cap'){const c=Math.round(12+light*16+highlight*20);color=`rgb(${c},${c+1},${c+1})`;}
      else if(material==='base'){const c=Math.round(23+light*30+highlight*52);color=`rgb(${c},${c+2},${c+3})`;}
      else if(material==='core'){const c=Math.round(55+light*96+highlight*75);color=`rgb(${c},${c},${Math.round(c*.91)})`;}
      else if(material==='led')color=`rgb(255,${Math.round(143+light*55)},35)`;
      else {
        const front=n[2]>0,alpha=material==='rib'?(front?.30:.08):(front?.36:.10);
        color=this.clear
          ? `rgba(${Math.round(178+light*64+highlight*13)},${Math.round(188+light*55+highlight*12)},${Math.round(193+light*50+highlight*12)},${alpha+highlight*.30})`
          : `rgba(${Math.round(205+light*45+highlight*5)},${Math.round(99+light*61+highlight*80)},${Math.round(9+highlight*155)},${alpha+highlight*.30})`;
      }
      if(emissive)color=material==='rib'?'rgba(255,153,12,.65)':'rgba(255,129,0,.90)';
      ctx.beginPath();face.vertices.forEach(([x,y,z],i)=>{const f=p.depth/(p.depth-z),xx=p.x+x*f,yy=p.y+1+y*f;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});
      ctx.closePath();ctx.fillStyle=color;ctx.fill();
      // Tiny opaque seams close rasterization gaps in the machined base only.
      if(material==='base'||material==='cap'){ctx.strokeStyle=color;ctx.lineWidth=.12;ctx.stroke();}
    }
    ctx.restore();
    canvas.dataset.model='solid-beacon-3d';
    canvas.dataset.variant=this.variant;
    canvas.dataset.rotation=JSON.stringify(p);
  }
}
