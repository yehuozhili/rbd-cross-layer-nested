import React, { useState } from "react";
import "./App.css";
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
				切换内层拖拽
			</button>
			<button
				onClick={() => {
					setState("inner");
				}}
			>
				切换外层拖拽
			</button>
			<MyDemo action={state}></MyDemo>
		</div>
	);
}

export default App;
