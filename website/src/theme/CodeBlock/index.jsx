import React, { useRef, useEffect } from 'react';
import CodeBlock from '@theme-init/CodeBlock';

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
  useEffect(() => {
    const blob = new Blob([template.replace('#{body}', `
      <script src="${location.origin}/learn-webgl/examples/core.js"></script>
      <script src="${location.origin}/learn-webgl/examples/math.js"></script>
      <script>window.onload=function(){${children}}</script>
    `)], {type: 'text/html'})
    const blobUrl = URL.createObjectURL(blob)

    let interObserver;
    if ('IntersectionObserver' in window) {
      let canRun = true
      let lastArgs = null
      let raf = () => {}
  
      iframe.current.onload = function() {
        const originRequestAnimationFrame = iframe.current.contentWindow.requestAnimationFrame
        raf = (...args) => {
          if (!canRun) {
            lastArgs = args
            return
          }
          return originRequestAnimationFrame.apply(iframe.current.contentWindow, args)
        }
        iframe.current.contentWindow.requestAnimationFrame = raf
      }
  
      interObserver = new IntersectionObserver((entries) => {
        canRun = entries[0].isIntersecting
        if (lastArgs && lastArgs.length && entries[0].isIntersecting) {
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

const withLiveEditor = (Component) => {
  const WrappedComponent = ({ run, hide, ...rest }) => {
    return (<>
      {!hide && <Component {...rest} />}
      {run && <Preview {...rest} />}
    </>)
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
