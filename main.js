import './style.css'

import htmlWorked  from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorked  from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorked  from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import {encode, decode} from 'js-base64'
import * as monaco from 'monaco-editor'

const $ = (selector) => document.querySelector(selector)

const $html = $("#html")
const $css  = $("#css")
const $js   = $("#javascript")

window.MonacoEnvironment = {
    getWorker : (_,label)=>{
      if(label ==='html'){
        return new htmlWorked()
      }

      if(label ==='css'){
        return new CssWorked()
      }

      if(label ==='typescript'){
        return new JsWorked()
      }
    }
}

const { pathname } = window.location

const [rawHtml,rawCss,rawJs] = pathname.slice(1).split('%7C')

const html =  rawHtml ? decode(rawHtml) : ''
const css  =  rawCss ? decode(rawCss) :''
const js   =  rawJs ? decode(rawJs) : ''

let element =  createHTML( html, css, js )

$("iframe").setAttribute('srcdoc',element) 


const htmlEditor = monaco.editor.create($html,{
  theme:'vs-dark',
  value:html,
  language:'html',
  fontSize:'15px',
  minimap:{enabled:false}
  
})

const CssEditor = monaco.editor.create($css,{
  theme:'vs-dark',
  language:'css',
  value:css,
  fontSize:'15px',
  minimap:{enabled:false}
})

const JsEditor = monaco.editor.create($js,{
  theme:'vs-dark',
  value:js,
  language:'typescript',
  fontSize:'15px',
  minimap:{enabled:false}
})


htmlEditor.onDidChangeModelContent(update)
CssEditor.onDidChangeModelContent(update)
JsEditor.onDidChangeModelContent(update)

function update(){
 
  let HTML   =  htmlEditor.getValue()
  let CSS    =  CssEditor.getValue()
  let JS     =  JsEditor.getValue()

  const url = `${encode(HTML)}|${encode(CSS)}|${encode(JS)}`
  history.replaceState(null, null, url)
  let element = createHTML(HTML, CSS, JS )
  $("iframe").setAttribute('srcdoc',element)

}

function createHTML ( html, css, js ) {

  return `
  <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>codecompiler</title>
          </head>
        <style>
          ${ css }
        </style>


        <body>
        
        ${ html }

          <script>
            ${ js }
          </script>
        </body>
    </html>
  
  
  `
}

