const text1 = "hello world";
const text2 = "This is a test. With two sentences! And a third.";

const chunks1 = text1.match(/[^.!?]+[.!?]+|\s*$/g)?.filter(c => c.trim().length > 0) || [];
if (chunks1.length === 0) chunks1.push(text1);

const chunks2 = text2.match(/[^.!?]+[.!?]+|\s*$/g)?.filter(c => c.trim().length > 0) || [];
if (chunks2.length === 0) chunks2.push(text2);

console.log("chunks1:", chunks1);
console.log("chunks2:", chunks2);
