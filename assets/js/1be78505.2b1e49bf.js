(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[514,608],{3616:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return te}});var a=n(7294),i=n(3905),r=n(2263),o=n(6291),l=n(9349),c=n(2122),s=n(9756),u=n(6010),d=n(9732),m=n(944),b=n(1839),p=n(3783),h=n(7898),f=n(6742),v=n(3919),E=n(5537),g=function(e){return a.createElement("svg",(0,c.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))},k=n(4478),C=n(8617),_=n(4973),Z="sidebar_15mo",N="sidebarWithHideableNavbar_267A",I="sidebarHidden_2kNb",y="sidebarLogo_3h0W",w="menu_Bmed",S="menuLinkText_2aKo",A="menuWithAnnouncementBar_2WvA",R="collapseSidebarButton_1CGd",T="collapseSidebarButtonIcon_3E-R",L="sidebarMenuIcon_fgN0",x="sidebarMenuCloseIcon_1lpH";var M=function e(t,n){return"link"===t.type?(0,d.Mg)(t.href,n):"category"===t.type&&t.items.some((function(t){return e(t,n)}))},B=(0,a.memo)((function(e){var t=e.items,n=(0,s.Z)(e,["items"]);return t.map((function(e,t){return a.createElement(P,(0,c.Z)({key:t,item:e},n))}))}));function P(e){switch(e.item.type){case"category":return a.createElement(F,e);case"link":default:return a.createElement(W,e)}}function F(e){var t,n,i,r=e.item,o=e.onItemClick,l=e.collapsible,d=e.activePath,m=(0,s.Z)(e,["item","onItemClick","collapsible","activePath"]),b=r.items,p=r.label,h=M(r,d),f=(n=h,i=(0,a.useRef)(n),(0,a.useEffect)((function(){i.current=n}),[n]),i.current),v=(0,a.useState)((function(){return!!l&&(!h&&r.collapsed)})),E=v[0],g=v[1],k=(0,a.useRef)(null),C=(0,a.useState)(void 0),_=C[0],Z=C[1],N=function(e){var t;void 0===e&&(e=!0),Z(e?(null==(t=k.current)?void 0:t.scrollHeight)+"px":void 0)};(0,a.useEffect)((function(){h&&!f&&E&&g(!1)}),[h,f,E]);var I=(0,a.useCallback)((function(e){e.preventDefault(),_||N(),setTimeout((function(){return g((function(e){return!e}))}),100)}),[_]);return 0===b.length?null:a.createElement("li",{className:(0,u.Z)("menu__list-item",{"menu__list-item--collapsed":E})},a.createElement("a",(0,c.Z)({className:(0,u.Z)("menu__link",(t={"menu__link--sublist":l,"menu__link--active":l&&h},t[S]=!l,t)),onClick:l?I:void 0,href:l?"#!":void 0},m),p),a.createElement("ul",{className:"menu__list",ref:k,style:{height:_},onTransitionEnd:function(){E||N(!1)}},a.createElement(B,{items:b,tabIndex:E?"-1":"0",onItemClick:o,collapsible:l,activePath:d})))}function W(e){var t=e.item,n=e.onItemClick,i=e.activePath,r=(e.collapsible,(0,s.Z)(e,["item","onItemClick","activePath","collapsible"])),o=t.href,l=t.label,d=M(t,i);return a.createElement("li",{className:"menu__list-item",key:l},a.createElement(f.Z,(0,c.Z)({className:(0,u.Z)("menu__link",{"menu__link--active":d}),to:o},(0,v.Z)(o)&&{isNavLink:!0,exact:!0,onClick:n},r),(0,v.Z)(o)?l:a.createElement("span",null,l,a.createElement(C.Z,null))))}function O(e){var t=e.onClick;return a.createElement("button",{type:"button",title:(0,_.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,_.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,u.Z)("button button--secondary button--outline",R),onClick:t},a.createElement(g,{className:T}))}function D(e){var t=e.responsiveSidebarOpened,n=e.onClick;return a.createElement("button",{"aria-label":t?(0,_.I)({id:"theme.docs.sidebar.responsiveCloseButtonLabel",message:"Close menu",description:"The ARIA label for close button of mobile doc sidebar"}):(0,_.I)({id:"theme.docs.sidebar.responsiveOpenButtonLabel",message:"Open menu",description:"The ARIA label for open button of mobile doc sidebar"}),"aria-haspopup":"true",className:"button button--secondary button--sm menu__button",type:"button",onClick:n},t?a.createElement("span",{className:(0,u.Z)(L,x)},"\xd7"):a.createElement(k.Z,{className:L,height:24,width:24}))}var H=function(e){var t,n,i=e.path,r=e.sidebar,o=e.sidebarCollapsible,l=void 0===o||o,c=e.onCollapse,s=e.isHidden,f=function(){var e=(0,m.Z)().isAnnouncementBarClosed,t=(0,a.useState)(!e),n=t[0],i=t[1];return(0,h.Z)((function(t){var n=t.scrollY;e||i(0===n)})),n}(),v=(0,d.LU)(),g=v.navbar.hideOnScroll,k=v.hideableSidebar,C=(0,m.Z)().isAnnouncementBarClosed,S=function(){var e=(0,a.useState)(!1),t=e[0],n=e[1];(0,b.Z)(t);var i=(0,p.Z)();return(0,a.useEffect)((function(){i===p.D.desktop&&n(!1)}),[i]),{showResponsiveSidebar:t,closeResponsiveSidebar:(0,a.useCallback)((function(e){e.target.blur(),n(!1)}),[n]),toggleResponsiveSidebar:(0,a.useCallback)((function(){n((function(e){return!e}))}),[n])}}(),R=S.showResponsiveSidebar,T=S.closeResponsiveSidebar,L=S.toggleResponsiveSidebar;return a.createElement("div",{className:(0,u.Z)(Z,(t={},t[N]=g,t[I]=s,t))},g&&a.createElement(E.Z,{tabIndex:-1,className:y}),a.createElement("nav",{className:(0,u.Z)("menu","menu--responsive","thin-scrollbar",w,(n={"menu--show":R},n[A]=!C&&f,n)),"aria-label":(0,_.I)({id:"theme.docs.sidebar.navAriaLabel",message:"Sidebar navigation",description:"The ARIA label for documentation menu"})},a.createElement(D,{responsiveSidebarOpened:R,onClick:L}),a.createElement("ul",{className:"menu__list"},a.createElement(B,{items:r,onItemClick:T,collapsible:l,activePath:i}))),k&&a.createElement(O,{onClick:c}))},U=n(3491),j=n(4608),q=n(5977),K="docPage_31aa",Y="docMainContainer_3ufF",z="docMainContainerEnhanced_3NYZ",J="docSidebarContainer_3Kbt",X="docSidebarContainerHidden_3pA8",G="collapsedDocSidebar_2JMH",Q="expandSidebarButtonIcon_1naQ",V="docItemWrapperEnhanced_2vyJ",$="docItemWrapper_3FMP";function ee(e){var t,n,o,c,s,m=e.currentDocRoute,b=e.versionMetadata,p=e.children,h=(0,r.Z)(),f=h.siteConfig,v=h.isClient,E=b.pluginId,k=b.version,C=function(e){var t,n=e.versionMetadata,a=e.currentDocRoute,i=n.permalinkToSidebar,r=n.docsSidebars,o=i[a.path]||i[(t=a.path,t.endsWith("/")?t:t+"/")]||i[function(e){return e.endsWith("/")?e.slice(0,-1):e}(a.path)];return{sidebar:r[o],sidebarName:o}}({versionMetadata:b,currentDocRoute:m}),Z=C.sidebarName,N=C.sidebar,I=(0,a.useState)(!1),y=I[0],w=I[1],S=(0,a.useState)(!1),A=S[0],R=S[1],T=(0,a.useCallback)((function(){A&&R(!1),w(!y)}),[A]);return a.createElement(l.Z,{key:v,wrapperClassName:d.kM.wrapper.docPages,pageClassName:d.kM.page.docPage,searchMetadatas:{version:k,tag:(0,d.os)(E,k)}},a.createElement("div",{className:K},N&&a.createElement("aside",{className:(0,u.Z)(J,(t={},t[X]=y,t)),onTransitionEnd:function(e){e.currentTarget.classList.contains(J)&&y&&R(!0)}},a.createElement(H,{key:Z,sidebar:N,path:m.path,sidebarCollapsible:null==(n=null==(o=f.themeConfig)?void 0:o.sidebarCollapsible)||n,onCollapse:T,isHidden:A}),A&&a.createElement("div",{className:G,title:(0,_.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,_.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:T,onClick:T},a.createElement(g,{className:Q}))),a.createElement("main",{className:(0,u.Z)(Y,(c={},c[z]=y||!N,c))},a.createElement("div",{className:(0,u.Z)("container padding-top--md padding-bottom--lg",$,(s={},s[V]=y,s))},a.createElement(i.Zo,{components:U.Z},p)))))}var te=function(e){var t=e.route.routes,n=e.versionMetadata,i=e.location,r=t.find((function(e){return(0,q.LX)(i.pathname,e)}));return r?a.createElement(ee,{currentDocRoute:r,versionMetadata:n},(0,o.Z)(t)):a.createElement(j.default,e)}},4608:function(e,t,n){"use strict";n.r(t);var a=n(7294),i=n(9349),r=n(4973);t.default=function(){return a.createElement(i.Z,{title:(0,r.I)({id:"theme.NotFound.title",message:"Page Not Found"})},a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(r.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."))))))}},4503:function(e,t,n){"use strict";var a,i=n(9756),r=n(7294),o=n(210),l=n(2263),c=function(e){var t=e.children,n=(0,r.useRef)(),a=(0,l.Z)().siteConfig.baseUrl;return(0,r.useEffect)((function(){var e,i=location.origin+a,r=new Blob(['\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <style>html,body{height:100%;} body{ margin: 0 }</style>\n</head>\n<body>#{body}</body>\n</html>\n'.replace("#{body}",'\n      <script src="'+i+'examples/math.js"><\/script>\n      <script src="'+i+'examples/core.js"><\/script>\n      <script>window.onload=function(){'+t+"}<\/script>\n    ")],{type:"text/html"}),o=URL.createObjectURL(r);if("IntersectionObserver"in window){var l=!0,c=null,s=function(){};n.current.onload=function(){var e=n.current.contentWindow,t=e.requestAnimationFrame;s=function(){for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];if(l)return t.apply(e,a);c=a},e.requestAnimationFrame=s},(e=new IntersectionObserver((function(e){(l=e[0].isIntersecting)&&c&&c.length&&(s.apply(void 0,c),c=null)}),{root:null,threshold:0})).observe(n.current)}return n.current.src=o,function(){e&&e.disconnect(),URL.revokeObjectURL(o)}}),[]),r.createElement("iframe",{ref:n,style:{border:0,width:"100%",minWidth:350,height:350}})};t.Z=(a=o.Z,function(e){var t=e.run,n=e.hide,o=(0,i.Z)(e,["run","hide"]);return r.createElement(r.Fragment,null,!n&&r.createElement(a,o),t&&r.createElement(c,o))})}}]);