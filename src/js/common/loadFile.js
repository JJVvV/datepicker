/**
 * Created by Administrator on 2015/7/25.
 */

const SCRIPT = 'script';
const CSS = 'css';
let types = [SCRIPT, CSS];


function getType(src){
  return src.split('.').pop().toUpperCase();
}

function generateScript(src){
  let script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);
  document.getElementsByTagName("head")[0].appendChild(script);

  return script;
}
function generateLink(src){
  let link = document.createElement('link');
  link.setAttribute("rel","stylesheet");
  link.setAttribute("type","text/css");
  link.setAttribute("href",src);
  document.getElementsByTagName("head")[0].appendChild(link);
  return link;
}



export default function loadFile(src){
  let type = getType.apply(null, arguments),elem;

  if(type === SCRIPT){
    ele = generateScript.apply(this, arguments);
  }else if(type === CSS){
    elem = generateLink.apply(this, arguments);
  }
  return new Promise((resolve, reject) => {
    ele.onreadystatechange = function() {
      if(this.readyState == "loaded" || this.readyState == "complete"){
        resolve();
      }
    }

  });


}
