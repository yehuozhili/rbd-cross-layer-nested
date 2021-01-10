import { useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "react-beautiful-dnd";
import Answers from "./answer";

const item = (str: string) => {
	return {
		id: str + Math.random(),
		content: "str",
		children: [],
	};
};

const data = [item("1"), item("2"), item("3")];

const grid = 6;
export const getItemStyle = (isDragging: boolean, draggableStyle: any) => {
	return {
		// some basic styles to make the items look a bit nicer
		userSelect: "none",
		padding: grid * 2,
		margin: `0 0 ${grid}px 0`,
		textAlign: "right",

		// change background colour if dragging
		background: isDragging ? "lightgreen" : "grey",

		// styles we need to apply on draggables
		...draggableStyle,
	};
};

function MyDemo(props: { action: string }) {
	const [state, setState] = useState(data);
	const onDragEnd = (result: DropResult) => {
		// dropped outside the list
		console.log(result);
		console.log(state);
		if (!result.destination) {
			return;
		}
		const regexp = /wrapper/;
		if (regexp.exec(result.destination.droppableId)) {
			//说明是嵌套拖拽
		} else {
			//说明非嵌套
		}
		console.log(result.type);
	};
	return (
		<div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="wrapper"
					type="hello"
					isDropDisabled={props.action === "top"}
				>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={{
								background: snapshot.isDraggingOver
									? "lightblue"
									: "lightgrey",
								padding: 8,
								width: 500,
							}}
						>
							{state.map((question: any, index: number) => (
								<Draggable
									key={question.id}
									draggableId={question.id}
									index={index}
								>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											style={getItemStyle(
												snapshot.isDragging,
												provided.draggableProps.style
											)}
										>
											{question.content}
											<span {...provided.dragHandleProps}>
												<div
													style={{
														float: "left",
													}}
												>
													+++
												</div>
											</span>
											<Answers
												action={props.action}
												questionNum={index}
												question={question}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
}

export default MyDemo;
