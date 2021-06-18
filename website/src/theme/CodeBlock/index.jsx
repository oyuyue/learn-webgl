import React, { useRef, useEffect } from 'react';
import CodeBlock from '@theme-init/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const template = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>html,body{height:100%;} body{ margin: 0 }</style>
</head>
<body>#{body}</body>
</html>
`

const Preview = ({ children }) => {
  const iframe = useRef()
  const { siteConfig: { baseUrl } } = useDocusaurusContext()

  useEffect(() => {
    const prefix = location.origin + baseUrl
    const blob = new Blob([template.replace('#{body}', `
      <script src="${prefix}examples/math.js"></script>
      <script src="${prefix}examples/core.js"></script>
      <script>window.onload=function(){${children}}</script>
    `)], {type: 'text/html'})
    const blobUrl = URL.createObjectURL(blob)

    let interObserver;
    if ('IntersectionObserver' in window) {
      let canRun = true
      let lastArgs = null
      let raf = () => {}
  
      iframe.current.onload = function() {
        const contentWindow = iframe.current.contentWindow
        const originRequestAnimationFrame = contentWindow.requestAnimationFrame
        raf = (...args) => {
          if (!canRun) {
            lastArgs = args
            return
          }
          return originRequestAnimationFrame.apply(contentWindow, args)
        }
        contentWindow.requestAnimationFrame = raf
      }
  
      interObserver = new IntersectionObserver((entries) => {
        canRun = entries[0].isIntersecting
        if (canRun && lastArgs && lastArgs.length) {
          raf(...lastArgs)
          lastArgs = null
        }
      }, {
        root: null,
        threshold: 0
      })
      interObserver.observe(iframe.current)
    }

    iframe.current.src = blobUrl

    return () => {
      if (interObserver) interObserver.disconnect()
      URL.revokeObjectURL(blobUrl)
    }
  }, [])

  return <iframe ref={iframe} style={{ border: 0, width: '100%', minWidth: 350, height: 350 }}/>
}

const withPreview = (Component) => ({ run, hide, ...rest }) => (<>
  {!hide && <Component {...rest} />}
  {run && <Preview {...rest} />}
</>);

export default withPreview(CodeBlock);
