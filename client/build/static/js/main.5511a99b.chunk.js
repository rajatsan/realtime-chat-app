(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{54:function(e,n,t){e.exports=t(99)},6:function(e,n){e.exports={sessionApi:"/api/session",headers:{Accept:"application/json","Content-Type":"application/json"}}},60:function(e,n,t){},87:function(e,n){},90:function(e,n,t){},92:function(e,n,t){},99:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),r=t(48),s=t.n(r),i=t(10),u=t(11),c=t(13),l=t(12),d=t(14),p=t(109),m=t(31),h=t.n(m),g=t(49),f=t(50),v=t(6),E=(t(60),function(e){function n(e){var t;return Object(i.a)(this,n),(t=Object(c.a)(this,Object(l.a)(n).call(this,e))).handleInput=function(e){return function(n){t.setState(Object(f.a)({},e,n.target.value))}},t.login=Object(g.a)(h.a.mark(function e(){var n,a,o,r,s;return h.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.state,a=n.username,o=n.password,e.prev=1,e.next=4,fetch(v.sessionApi,{method:"put",body:JSON.stringify({username:a,password:o}),headers:v.headers});case 4:return r=e.sent,e.next=7,r.json();case 7:s=e.sent,t.props.onLogin(s.username),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),console.log("username/password is invalid");case 14:case"end":return e.stop()}},e,null,[[1,11]])})),t.signup=function(){var e=t.state,n=e.username,a=e.password;e.confPassword;fetch(v.sessionApi,{method:"post",body:JSON.stringify({username:n,password:a}),headers:v.headers}).then(function(e){200==e.status?t.setState({signup:!1}):console.error("already exists")})},t.renderLogin=function(){return o.a.createElement("div",null,o.a.createElement("div",null,"Login"),o.a.createElement("button",{onClick:t.login},"Login"),o.a.createElement("div",null,"Username",o.a.createElement("input",{onChange:t.handleInput("username")})),o.a.createElement("div",null,"Password",o.a.createElement("input",{onChange:t.handleInput("password")})),o.a.createElement("hr",null),o.a.createElement("div",null,"New user? "),o.a.createElement("button",{onClick:function(){return t.setState({signup:!0})}},"Signup "))},t.renderSignUp=function(){return o.a.createElement("div",null,o.a.createElement("div",null,"Signup"),o.a.createElement("button",{onClick:t.signup},"Signup"),o.a.createElement("div",null,"Username",o.a.createElement("input",{onChange:t.handleInput("username")})),o.a.createElement("div",null,"Password",o.a.createElement("input",{onChange:t.handleInput("password")})),o.a.createElement("div",null,"Confirm Password",o.a.createElement("input",{onChange:t.handleInput("confPassword")})),o.a.createElement("hr",null),o.a.createElement("div",null,"Existing user? "),o.a.createElement("button",{onClick:function(){return t.setState({signup:!1})}},"Login "))},t.state={username:"",password:"",confPassword:"",signup:!1},t}return Object(d.a)(n,e),Object(u.a)(n,[{key:"render",value:function(){return o.a.createElement("div",null,this.state.signup?this.renderSignUp():this.renderLogin())}}]),n}(o.a.Component)),w=t(51),b=t.n(w).a.connect("http://localhost:5000");b.on("error",function(e){console.log("socket error",e)});t(90);var j=function(e){function n(){var e,t;Object(i.a)(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(t=Object(c.a)(this,(e=Object(l.a)(n)).call.apply(e,[this].concat(o)))).logout=function(){fetch(v.sessionApi,{method:"delete"}).then(t.props.onLogout)},t}return Object(d.a)(n,e),Object(u.a)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.a.createElement("div",null,"Home",o.a.createElement("button",{onClick:this.logout},"Logout"),o.a.createElement("div",null,"Logged in as ",this.props.user))}}]),n}(o.a.Component),L=(t(91),t(92),function(e){function n(){var e,t;Object(i.a)(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(t=Object(c.a)(this,(e=Object(l.a)(n)).call.apply(e,[this].concat(o)))).state={username:"",isLoading:!1},t.onLogout=function(){t.setState({username:""})},t.onLogin=function(e){t.setState({username:e})},t}return Object(d.a)(n,e),Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({isLoading:!0}),fetch(v.sessionApi).then(function(e){return e.json()}).then(function(n){n.user&&n.user.username?e.setState({username:n.user.username,isLoading:!1}):e.setState({username:"",isLoading:!1})}).catch(function(n){e.setState({isLoading:!1}),console.log(n)})}},{key:"render",value:function(){return this.state.isLoading?o.a.createElement("div",{className:"body"},o.a.createElement(p.a,null)):o.a.createElement("div",null,this.state.username?o.a.createElement(j,{onLogout:this.onLogout,user:this.state.username}):o.a.createElement(E,{onLogin:this.onLogin}))}}]),n}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(L,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[54,1,2]]]);
//# sourceMappingURL=main.5511a99b.chunk.js.map