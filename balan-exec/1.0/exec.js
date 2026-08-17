let i = 0;
const opers = ["+","-","*","/",".",",","fx"];
const exprs = [
    "2 3 + 8 6 - * 2 /",
    "Math PI .",
    "console log . [] 1 , 2 , 3 , fx",
    "opr cong . [] 1.0 , 2 , .6 , 3 , 4 , 5 , 6 , fx",
    "opr cong . [] 1.4 , 2.6 , fx"
    
]; 
function exec(expr) {
	let justDot = false;
	let i = 0;
	let ch;
	while (i < expr.length) {
		ch = expr[i];
		if (!opers.includes(ch)) {
			i++;
			continue;
		}
		const value = calc(ch, expr[i- 2], expr[i- 1]);
		expr.splice(i-2,3,value);
		i--;
	}
	return expr[0];
}
function parse(operand) {
	let n = parseFloat(operand);
	if (!Number.isNaN(n)) return n;
	n = parseInt(operand);
	if (!Number.isNaN(n)) return n;
	return operand;
}
function calc(op, a, b) {
	return fx[op](a,b);
}
const fx = {};
fx["."] = function (a,b) {
	let self;
	if (typeof a == "string") {
		self = window[a];
	} else {
		self = a;
	}
	return self[b];
};
fx[","] = (a,b)=>{
	if (a=="[]") a=[];
	a.push(b);
	return a;
};
fx["fx"] = (f,arr) => {
	const res = f(...arr);
	return res;
};
fx["+"]=(a,b)=>a+b;
fx["-"]=(a,b)=>a-b;
fx["*"]=(a,b)=>a*b;
fx["/"]=(a,b)=>a/b;
var opr = {cong(...n) {
   let res = 0;
   n.forEach(x=>res+=x);
   return res;
}};
exprs.forEach(exs => {
console.log(exs,"\n",exec(exs.split(" ").map(parse)));
});