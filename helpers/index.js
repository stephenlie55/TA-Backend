let fs = require('fs')
let data = JSON.parse(fs.readFileSync('./source/finalData.json'))

/* EMALGORITHM */
var emalgorithm = emalgorithm || {}
emalgorithm.users = {};
emalgorithm.items = new Array();
emalgorithm.
emalgorithm.itemindecs = {};
emalgorithm.PIcollection=new Array();
emalgorithm.W=new Array();
emalgorithm.E=new Array();
emalgorithm._pi=[];

emalgorithm.add = function(u,i,v) {
  if(!(u in emalgorithm.users)){
    emalgorithm.users[u] = new Array();
    for(var k=0;k<emalgorithm.items.length;k++){
      emalgorithm.users[u].push(null);
    }
  }
  if(!(i in emalgorithm.itemindecs)){
    emalgorithm.itemindecs[i]=emalgorithm.items.length;
    emalgorithm.items.push(i);
    for(k in emalgorithm.users){
      emalgorithm.users[k].push(null);
      emalgorithm._pi.push({});
      emalgorithm._pi[emalgorithm.items.length-1][null]=0.0;
      emalgorithm._pi[emalgorithm.items.length-1][v]=0.0;
    }
  }
  emalgorithm.users[u][emalgorithm.itemindecs[i]]=v;
  if(!(v in emalgorithm._pi[emalgorithm.itemindecs[i]])) emalgorithm._pi[emalgorithm.itemindecs[i]][v]=0.0;
}

emalgorithm.clone = function(obj){
  if(obj == null || typeof(obj) != 'object') return obj;
  var temp = obj.constructor();
  for(var key in obj) temp[key]=emalgorithm.clone(obj[key]);
  return temp;
}

emalgorithm.initPIcollection = function() {
  for(var i=0;i<emalgorithm.NUMCLASS;i++){
    emalgorithm.PIcollection[i]=emalgorithm.clone(emalgorithm._pi);
    for(var k in emalgorithm.items){
      var pi=emalgorithm.PIcollection[i][k];
      var l=0;for(var j in pi) l++;
      var r=new Array(l);
      for(var m=0;m<l;m++) r[m]=1.0/l;
      for(var m=0;m<l-1;m++){var d=r[m]*Math.random()/5;r[m]+=d;r[m+1]-=d;}
      var m=0;for(var j in pi)pi[j]=r[m++];
    }
  }
}

emalgorithm.initW=function() {
  var W = emalgorithm.W;
  for(var i=0;i<W.length;i++) W[i]=1.0/emalgorithm.NUMCLASS;
  for(var i=0;i<W.length-1;i++){var rnd=Math.random()*W[i]/2;W[i]-=rnd;W[i+1]+=rnd;}
}

emalgorithm.initE=function() {
  var E = emalgorithm.E;
  for(var n=0;n<emalgorithm.NUMCLASS;n++){
    for(var u in emalgorithm.users) {
      E[n]={}
      for(var u in emalgorithm.users) E[n][u]=1.0/emalgorithm.NUMCLASS
    }
  }
}

emalgorithm.initNUMCLASS=function(n){
    emalgorithm.NUMCLASS=n;
    emalgorithm.PIcollection=new Array(n);
    emalgorithm.W=new Array(n);
    emalgorithm.E=new Array(n);
    emalgorithm.users={}
    emalgorithm.items=new Array();
    emalgorithm.itemindecs={}
    emalgorithm._pi=new Array();
}

//var likelihood;
emalgorithm.Estep = function() {
  for(var n=0;n<emalgorithm.NUMCLASS;n++) {
    for(var u in emalgorithm.users) {
      var p = 0.0;for(var i in emalgorithm.items)p+=Math.log(emalgorithm.PIcollection[n][i][emalgorithm.users[u][i]]);
      emalgorithm.E[n][u]=Math.exp(Math.log(emalgorithm.W[n])+p);//temporary
    }
  }
  var likelihood=0.0;
  for(var u in emalgorithm.users) {
    var de=0.0;for(var n=0;n<emalgorithm.NUMCLASS;n++)de+=emalgorithm.E[n][u];
    for(var n=0;n<emalgorithm.NUMCLASS;n++)emalgorithm.E[n][u]/=de;
    likelihood+=Math.log(de);
  }
  return likelihood;
}
emalgorithm.Mstep=function() {
  for(var n=0;n<emalgorithm.NUMCLASS;n++) {
    var no=0.0;for(var u in emalgorithm.users)no+=emalgorithm.E[n][u];
    emalgorithm.W[n]=no/emalgorithm.NUMCLASS;
    for(var k in emalgorithm.items){
      var pi = emalgorithm.PIcollection[n][k];
      for(var j in pi) {
        pi[j]=0.0;for(var u in emalgorithm.users)if((emalgorithm.users[u][k]==null&&j=="null") || emalgorithm.users[u][k]==j) pi[j] += emalgorithm.E[n][u];
        pi[j]/=(emalgorithm.W[n]*emalgorithm.NUMCLASS);
      }
    }
  }
}
emalgorithm.MaxE=function(cnt,ug) {
  for(var u in emalgorithm.users) {
    var m=-1.0;var nu=-1;for(var n=0;n<emalgorithm.NUMCLASS;n++)if(m<emalgorithm.E[n][u]){m=emalgorithm.E[n][u];nu=n;}
    cnt[nu]++;ug[nu].push(u);
  }
}
emalgorithm.exec = function(MAXLOOP,COND){
  var likelihood=0.0;
  for(var loop=0;loop<MAXLOOP;loop++) {
    var oldL=likelihood;
    likelihood=emalgorithm.Estep()
    emalgorithm.Mstep()
    if(oldL){
      if(Math.abs((likelihood-oldL)/likelihood)<COND)break;
    }
  }
  return [likelihood,loop]
}

function debug() {
  for(var k in users) print("user:"+k+":"+users[k]);
  print(items);
  for(var k in itemindecs) print("item:"+k+":"+itemindecs[k]);
  for(var n=0;n<NUMCLASS;n++) {
    for(var k in items){
      var pi = PIcollection[n][k];
      var l=0;for(var j in pi) l++;
      print("PIcollection["+n+"]["+k+"].length="+l);
      for(var j in pi) print("PIcollection["+n+"]["+k+"]:"+j+":"+pi[j]);
    }
  }
  print(W);
  print(E);
}

// -------------------------------------------------------------------------------------------------------------------------------------

var myloop = 0, showtab = 0
    function load() {
      
      myloop = 0; showtab = 0;
      NUMCLASS = 100
      emalgorithm.initNUMCLASS(NUMCLASS);

      for (var i=0; i<data.length; i++) {
        emalgorithm.add(data[i].productName, data[i].productShortName, 'o');
      }

      emalgorithm.initPIcollection();
      emalgorithm.initW()
      emalgorithm.initE()
    }

    function computeAll() {
      MAXLOOP = 200;
      COND = parseFloat("1e-15");
      var res = emalgorithm.exec(MAXLOOP, COND)
      showresult(res[0], res[1])
    }

    var likelihood;
    function computeOnestep() {
      var oldL = likelihood;
      likelihood = emalgorithm.Estep();
      emalgorithm.Mstep();
      myloop++;
      showresult(likelihood, myloop);
    }
    
    function showresult(r1, r2) {
      var c = new Array(emalgorithm.NUMCLASS), group = new Array(emalgorithm.NUMCLASS);
      for (var i = 0; i < emalgorithm.NUMCLASS; i++) { 
          c[i] = 0; 
          group[i] = new Array(); 
      }
      emalgorithm.MaxE(c, group)

      var s = "";
      s += "L=" + r1 + ",loop=" + r2 + "\n\n"
      for (var i = 0; i < emalgorithm.NUMCLASS; i++) {
        s += i + ":" + group[i] + "\n"
      }

      console.log(s)
    }


load()
computeAll()