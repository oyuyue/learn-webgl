(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[121],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return s},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},p=Object.keys(e);for(r=0;r<p.length;r++)n=p[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(r=0;r<p.length;r++)n=p[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),c=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,p=e.originalType,i=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,g=m["".concat(i,".").concat(d)]||m[d]||u[d]||p;return n?r.createElement(g,l(l({ref:t},s),{},{components:n})):r.createElement(g,l({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var p=n.length,l=new Array(p);l[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<p;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3098:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return o},metadata:function(){return i},toc:function(){return c},default:function(){return u}});var r=n(2122),a=n(9756),p=(n(7294),n(3905)),l={},o="\u4ecb\u7ecd",i={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"\u4ecb\u7ecd",description:"WebGL\uff08Web\u56fe\u5f62\u5e93\uff09\u662f\u4e00\u4e2aJavaScript API\uff0c\u53ef\u5728\u4efb\u4f55\u517c\u5bb9\u7684 Web \u6d4f\u89c8\u5668\u4e2d\u6e32\u67d3\u9ad8\u6027\u80fd\u7684\u4ea4\u4e92\u5f0f 3D \u548c 2D \u56fe\u5f62\u6216\u5927\u91cf\u8ba1\u7b97\uff08\u673a\u5668\u5b66\u4e60\u7b49\uff09\uff0c\u800c\u65e0\u9700\u4f7f\u7528\u63d2\u4ef6\uff0c\u7531\u975e\u8425\u5229 Khronos Group \u8bbe\u8ba1\u548c\u7ef4\u62a4\u3002",source:"@site/docs/1-intro.md",sourceDirName:".",slug:"/intro",permalink:"/learn-webgl/docs/intro",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/1-intro.md",version:"current",sidebarPosition:1,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\u524d\u8a00",permalink:"/learn-webgl/docs/preface"},next:{title:"\u5750\u6807\u7cfb",permalink:"/learn-webgl/docs/coordinate"}},c=[{value:"OpenGL",id:"opengl",children:[]},{value:"GPU",id:"gpu",children:[]},{value:"\u6e32\u67d3\u7ba1\u7ebf",id:"\u6e32\u67d3\u7ba1\u7ebf",children:[]},{value:"\u4f8b\u5b50",id:"\u4f8b\u5b50",children:[{value:"ThreeJS",id:"threejs",children:[]},{value:"WebGL Samples",id:"webgl-samples",children:[]},{value:"Experiments with Google",id:"experiments-with-google",children:[]},{value:"Adult Swim",id:"adult-swim",children:[]},{value:"Evan Wallace",id:"evan-wallace",children:[]}]}],s={toc:c};function u(e){var t=e.components,l=(0,a.Z)(e,["components"]);return(0,p.kt)("wrapper",(0,r.Z)({},s,l,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("h1",{id:"\u4ecb\u7ecd"},"\u4ecb\u7ecd"),(0,p.kt)("p",null,"WebGL\uff08Web\u56fe\u5f62\u5e93\uff09\u662f\u4e00\u4e2aJavaScript API\uff0c\u53ef\u5728\u4efb\u4f55\u517c\u5bb9\u7684 Web \u6d4f\u89c8\u5668\u4e2d\u6e32\u67d3\u9ad8\u6027\u80fd\u7684\u4ea4\u4e92\u5f0f 3D \u548c 2D \u56fe\u5f62\u6216\u5927\u91cf\u8ba1\u7b97\uff08\u673a\u5668\u5b66\u4e60\u7b49\uff09\uff0c\u800c\u65e0\u9700\u4f7f\u7528\u63d2\u4ef6\uff0c\u7531\u975e\u8425\u5229 Khronos Group \u8bbe\u8ba1\u548c\u7ef4\u62a4\u3002"),(0,p.kt)("p",null,"\u4f7f\u7528 WebGL \u7684\u65b9\u5f0f\u548c canvas 2d \u7c7b\u4f3c\uff0c\u90fd\u662f\u901a\u8fc7 ",(0,p.kt)("inlineCode",{parentName:"p"},"getContext")," \u65b9\u6cd5\u83b7\u53d6\u6e32\u67d3\u4e0a\u4e0b\u6587\u3002"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-js"},"const canvas = document.createElement('canvas')\n\nconst gl = (\n  canvas.getContext('webgl2') ||\n  canvas.getContext('webgl') ||\n  canvas.getContext('experimental-webgl')\n)\n")),(0,p.kt)("p",null,"\u4e0a\u9762\u4ee3\u7801\u4e2d\u662f\u6309\u7167 ",(0,p.kt)("inlineCode",{parentName:"p"},"webgl2"),"\u3001",(0,p.kt)("inlineCode",{parentName:"p"},"webgl"),"\u3001",(0,p.kt)("inlineCode",{parentName:"p"},"experimental-webgl")," \u7684\u987a\u5e8f\u83b7\u53d6 WebGL \u6e32\u67d3\u4e0a\u4e0b\u6587\u3002",(0,p.kt)("inlineCode",{parentName:"p"},"webgl2")," \u662f\u6700\u65b0\u7248\u672c\uff0c\u5b83\u51e0\u4e4e\u5b8c\u5168\u517c\u5bb9 WebGL1\u3002",(0,p.kt)("inlineCode",{parentName:"p"},"experimental-webgl")," \u7528\u6765\u517c\u5bb9\u8001\u6d4f\u89c8\u5668\uff0c\u5982 IE 11\u3002"),(0,p.kt)("p",null,(0,p.kt)("img",{src:n(6921).Z})),(0,p.kt)("p",null,"\u5927\u591a\u6570\u6d4f\u89c8\u5668\u90fd\u652f\u6301 WebGL1\u3002\u4e5f\u6709\u5f88\u591a\u73b0\u4ee3\u6d4f\u89c8\u5668\u652f\u6301 WebGL2\uff0c\u4f46\u662f\u82f9\u679c\u8fd8\u4e0d\u652f\u6301 WebGL2\uff0c\u6240\u4ee5\u7f16\u5199 WebGL \u7a0b\u5e8f\u65f6\uff0c\u9700\u8981\u5411\u4e0b\u964d\u7ea7\u5230 WebGL1\u3002"),(0,p.kt)("p",null,(0,p.kt)("img",{src:n(535).Z})),(0,p.kt)("h2",{id:"opengl"},"OpenGL"),(0,p.kt)("p",null,"WebGL \u662f\u57fa\u4e8e OpenGL\u7684\u3002OpenGL(Open Graphics Library) \u662f\u7528\u4e8e\u6e32\u67d32D\u30013D\u77e2\u91cf\u56fe\u5f62\u7684\u8de8\u8bed\u8a00\u3001\u8de8\u5e73\u53f0\u7684\u5e94\u7528\u7a0b\u5e8f\u7f16\u7a0b\u63a5\u53e3\uff0c\u5e38\u7528\u4e8eCAD\u3001\u865a\u62df\u73b0\u5b9e\u3001\u79d1\u5b66\u53ef\u89c6\u5316\u7a0b\u5e8f\u548c\u7535\u5b50\u6e38\u620f\u5f00\u53d1\u3002OpenGL \u901a\u5e38\u662f\u663e\u5361\u751f\u4ea7\u5546\u6839\u636e\u89c4\u8303\u6765\u5b9e\u73b0\u7684\u3002"),(0,p.kt)("p",null,"OpenGL \u524d\u8eab\u662f SGI \u7684 IRIS GL API \u5b83\u5728\u5f53\u65f6\u88ab\u8ba4\u4e3a\u662f\u6700\u5148\u8fdb\u7684\u79d1\u6280\u5e76\u6210\u4e3a\u4e8b\u5b9e\u4e0a\u7684\u884c\u4e1a\u6807\u51c6\uff0c\u540e\u7531 SGI \u8f6c\u53d8\u4e3a\u4e00\u9879\u5f00\u653e\u6807\u51c6 OpenGL\u30021992\u5e74 SGI \u521b\u5efa OpenGL\u67b6\u6784\u5ba1\u67e5\u59d4\u5458\u4f1a\uff0c2006\u5e74\u5c06 OpenGL API \u6807\u51c6\u7684\u63a7\u5236\u6743\u4ea4\u7ed9 Khronos Group\u3002"),(0,p.kt)("p",null,"OpenGL \u662f\u8de8\u5e73\u53f0\u7684\uff0c\u5728\u79fb\u52a8\u8bbe\u5907\u4e0a\u662f\u4f7f\u7528 OpenGL ES(OpenGL for Embedded Systems)\uff0c \u5b83\u662f OpenGL \u7684\u5b50\u96c6\u3002\u4e0b\u56fe\u5c55\u793a\u4e86 OpenGL \u548c OpenGL ES \u7684\u65f6\u95f4\u7ebf\u3002"),(0,p.kt)("p",null,(0,p.kt)("img",{src:n(5384).Z})),(0,p.kt)("p",null,"WebGL \u57fa\u4e8e OpenGL\uff0c\u662f OpenGL \u7684\u5b50\u96c6\u3002WebGL1 \u57fa\u4e8e OpenGL ES 2.0\u3002WebGL2 \u57fa\u4e8e OpenGL ES 3.0\u3002"),(0,p.kt)("h2",{id:"gpu"},"GPU"),(0,p.kt)("p",null,"WebGL \u6027\u80fd\u9ad8\u7684\u539f\u56e0\u662f\u5b83\u4f7f\u7528\u5230\u4e86 GPU\u3002GPU \u548c CPU \u9488\u5bf9\u7684\u662f\u4e24\u79cd\u4e0d\u540c\u7684\u5e94\u7528\u573a\u666f\uff0c\u5927\u5bb6\u53ef\u4ee5\u628a CPU \u60f3\u8c61\u4e3a\u4e00\u4e2a\u6559\u6388\uff0c\u5b83\u4ec0\u4e48\u90fd\u77e5\u9053\uff0c\u800c GPU \u662f\u4e00\u7fa4\u5c0f\u5b66\u751f\uff0c\u53ea\u80fd\u505a\u4e9b\u7b80\u5355\u7684\u8ba1\u7b97\uff0c\u6240\u4ee5\u5bf9\u4e8e\u5927\u91cf\u7b80\u5355\u8ba1\u7b97 GPU \u7684\u6267\u884c\u901f\u5ea6\u662f\u8fdc\u5927\u4e8e CPU \u7684\u3002"),(0,p.kt)("p",null,(0,p.kt)("img",{src:n(1412).Z})),(0,p.kt)("p",null,"\u4e0a\u56fe\u662f\u663e\u5361 3090 \u7684\u914d\u7f6e\u53c2\u6570\uff0c\u6211\u4eec\u53ef\u4ee5\u770b\u5230\u5b83\u6709 1 \u4e07\u591a\u4e2a\u6838\u5fc3\uff0c24G \u663e\u5b58\u3002\u652f\u6301 3D API\uff0cDirectX 12 Ultimate \u548c OpenGL 4.6 \uff08DirectX \u662f\u5fae\u8f6f\u7684\u56fe\u5f62 API\uff09\u3002"),(0,p.kt)("h2",{id:"\u6e32\u67d3\u7ba1\u7ebf"},"\u6e32\u67d3\u7ba1\u7ebf"),(0,p.kt)("p",null,"\u4e00\u822c WebGL \u7a0b\u5e8f\u662f JS \u63d0\u4f9b\u6570\u636e\uff08\u5728 CPU \u4e2d\u8fd0\u884c\uff09\uff0c\u7136\u540e\u5c06\u6570\u636e\u53d1\u9001\u5230\u663e\u5b58\u4e2d\uff0c\u4ea4\u7ed9 GPU \u6e32\u67d3\uff0c\u6211\u4eec\u53ef\u4ee5\u4f7f\u7528\u7740\u8272\u5668\u63a7\u5236 GPU \u6e32\u67d3\u7ba1\u7ebf\u90e8\u5206\u9636\u6bb5\u3002"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-js"},"// CPU\nconst vertexShader = `shader source code` // \u9876\u70b9\u7740\u8272\u5668\u4ee3\u7801\nconst fragmentShader = `shader source code` // \u7247\u6bb5\u7740\u8272\u5668\u4ee3\u7801\nconst points = [{ x: 1, y: 1, z: 1 }/* ... */]  // \u51c6\u5907\u6570\u636e\ngl.draw(points, vertexShader, fragmentShader) // \u5c06\u6570\u636e\u548c\u7740\u8272\u5668\u53d1\u9001\u7ed9 GPU\n\n// GPU\nconst positions = data.map(point => vertexShader(point)) // \u8fd0\u884c\u9876\u70b9\u7740\u8272\u5668\nconst frags = Rasterization(positions) // \u5149\u6805\u5316\nconst colors = frags.map(frag => fragmentShader(frag)) // \u8fd0\u884c\u7247\u6bb5\u7740\u8272\u5668\nDisplay(colors) // \u6e32\u67d3\u5230\u5c4f\u5e55\n")),(0,p.kt)("p",null,"\u4e0a\u9762\u7684\u4f2a\u4ee3\u7801\uff0c\u7b80\u5355\u5c55\u793a\u4e86 WebGL \u7a0b\u5e8f\u7684\u6267\u884c\u6d41\u7a0b\u3002OpenGL \u4e2d\u7740\u8272\u5668\u662f\u4f7f\u7528 GLSL \u7f16\u5199\uff0c\u5b83\u6709\u70b9\u7c7b\u4f3c C \u8bed\u8a00\uff0c\u6211\u4eec\u53ef\u4ee5\u901a\u8fc7\u9876\u70b9\u7740\u8272\u5668\u548c\u7247\u6bb5\u7740\u8272\u5668\u63a7\u5236 GPU \u6e32\u67d3\u7684\u90e8\u5206\u73af\u8282\u3002\u73b0\u5728\u8fd8\u4e0d\u4e86\u89e3\u6574\u4e2a\u6e32\u67d3\u7ba1\u7ebf\u6ca1\u6709\u5173\u7cfb\uff0c\u540e\u9762\u4f1a\u66f4\u52a0\u8be6\u7ec6\u7684\u8bb2\u89e3\u3002"),(0,p.kt)("h2",{id:"\u4f8b\u5b50"},"\u4f8b\u5b50"),(0,p.kt)("p",null,"WebGL \u6709\u975e\u5e38\u591a\u975e\u5e38\u9177\u7684\u4f8b\u5b50\uff0c\u4e0b\u9762\u5217\u4e3e\u4e00\u4e9b\u4e0d\u9519\u4f8b\u5b50\u3002"),(0,p.kt)("h3",{id:"threejs"},"ThreeJS"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://threejs.org/"},(0,p.kt)("img",{parentName:"a",src:"https://user-images.githubusercontent.com/25923128/120910186-50140d80-c6af-11eb-9a6d-f766c5d10a03.png",alt:null}))),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://threejs.org/"},"https://threejs.org/")),(0,p.kt)("h3",{id:"webgl-samples"},"WebGL Samples"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"http://webglsamples.org/"},(0,p.kt)("img",{parentName:"a",src:"https://user-images.githubusercontent.com/25923128/123609386-325f4180-d832-11eb-94b9-d23a5e6dd1d8.png",alt:null}))),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"http://webglsamples.org/"},"http://webglsamples.org/")),(0,p.kt)("h3",{id:"experiments-with-google"},"Experiments with Google"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://experiments.withgoogle.com/"},(0,p.kt)("img",{parentName:"a",src:"https://user-images.githubusercontent.com/25923128/123610777-7e5eb600-d833-11eb-8f56-d5714962cdef.png",alt:null}))),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://experiments.withgoogle.com/"},"https://experiments.withgoogle.com/")),(0,p.kt)("h3",{id:"adult-swim"},"Adult Swim"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://www.adultswim.com/etcetera/"},(0,p.kt)("img",{parentName:"a",src:"https://user-images.githubusercontent.com/25923128/123611113-d85f7b80-d833-11eb-89ce-e047c7dcc2b4.png",alt:null}))),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"https://www.adultswim.com/etcetera/"},"https://www.adultswim.com/etcetera/")),(0,p.kt)("h3",{id:"evan-wallace"},"Evan Wallace"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"http://madebyevan.com/"},(0,p.kt)("img",{parentName:"a",src:"https://user-images.githubusercontent.com/25923128/123612768-70aa3000-d835-11eb-8d2c-b1b59ca30d5f.png",alt:null}))),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"http://madebyevan.com/"},"http://madebyevan.com/")))}u.isMDXComponent=!0},1412:function(e,t,n){"use strict";t.Z=n.p+"assets/images/gpu-204e6f62cc8c0d814739657cbe4670b6.png"},5384:function(e,t,n){"use strict";t.Z=n.p+"assets/images/opengl-timeline-4cd2ab715dfc6272d3b31796fb6ae793.png"},6921:function(e,t,n){"use strict";t.Z=n.p+"assets/images/webgl-compat-65eae8370c62964f8b48a0fcb4bb8e3e.png"},535:function(e,t,n){"use strict";t.Z=n.p+"assets/images/webgl2-compat-2c9dc12732195ecd46c1b9ad065b58e4.png"}}]);