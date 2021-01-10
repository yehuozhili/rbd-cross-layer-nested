import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Questions from "./questions";
import MyDemo from "./my";

function App() {
	const [state, setState] = useState("top");
	return (
		<div className="App">
			<div>12313</div>
			<button
				onClick={() => {
					setState("top");
				}}
			>
				切换顶层
			</button>
			<button
				onClick={() => {
					setState("inner");
				}}
			>
				切换内层
			</button>
			<MyDemo action={state}></MyDemo>
		</div>
	);
}

export default App;
