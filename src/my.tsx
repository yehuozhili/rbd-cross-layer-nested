import { useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "react-beautiful-dnd";
import Answers from "./answer";
import { Reorder } from "./utils";

const item = (str: string) => {
	return {
		id: str,
		content: "str" + str,
		children: [],
	};
};

const data = [item("0"), item("1"), item("2")];

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
const regexp = /wrapper/;
const judgeResult = (result: DropResult) => {
	const target = regexp.exec(result.destination!.droppableId);
	const source = regexp.exec(result.source.droppableId);
	console.log(target, source);
	if (target && source) {
		//同外层
		return 0;
	} else if (target || source) {
		// 其中有一个是的，那么就是跨层级
		return 1;
	} else {
		// 同内层
		return -1;
	}
};

const toSplice = (result: DropResult, state: Array<any>, source: any) => {
	//如果是wrapper说明第一层
	if (source) {
		// 减少时 外层索引有可能变动，
		return state.splice(result.source.index, 1);
	} else {
		//否则是内层remove
		// 需要找到哪个内层，通过dropid获取
		// 此处还需要排除自己的内层。暂未实现
		return state[Number(result.source!.droppableId)].children.splice(
			result.source.index,
			1
		);
	}
};
const toAddItem = (
	result: DropResult,
	state: Array<any>,
	target: any,
	source: any,
	addItem: any
) => {
	//如果是wrapper说明第一层
	console.log(target);
	if (target) {
		state.splice(result.destination!.index, 0, addItem);
		return state;
	} else {
		//否则是内层add
		// 需要找到哪个内层，通过dropid获取
		// 此处还需要排除自己的内层。暂未实现
		// 此处需要判断外层索引是否变化

		// 需要比较大小，如果目标索引大于不能等于删除的索引 目标索引要减一
		let index;
		if (
			source &&
			result.source.index < Number(result.destination!.droppableId)
		) {
			//如果时第一层减少，那么需要判断索引变化
			index = Number(result.destination!.droppableId) - 1;
		} else {
			index = Number(result.destination!.droppableId);
		}

		state[index].children.splice(result.destination!.index, 0, addItem);
		return state;
	}
};

const situationResolve = (result: DropResult, state: Array<any>) => {
	const sign = judgeResult(result);
	console.log(sign);
	switch (sign) {
		case -1:
			//内层
			//先判断哪个列表
			// const id = result.destination?.droppableId
			// const answers = Reorder(
			// 	state[].children,
			// 	result.source.index,
			// 	result.destination!.index
			// );
			break;
		case 1:
			const source = regexp.exec(result.source.droppableId);
			const target = regexp.exec(result.destination!.droppableId);
			//先把source里的拿出来result.source.index,
			const [remove] = toSplice(result, state, source);
			//remove后添加进对应的destination
			console.log(remove);
			return toAddItem(result, state, target, source, remove);

		case 0:
			return Reorder(
				state,
				result.source.index,
				result.destination!.index
			);
	}
};

function MyDemo(props: { action: string }) {
	const [state, setState] = useState<any>(data);
	const onDragEnd = (result: DropResult) => {
		// dropped outside the list
		console.log(result);
		console.log(state);
		if (!result.destination) {
			return;
		}
		const newState = situationResolve(result, state);
		console.log(newState);
		//setState(newState);
		// if (newState) {
		// 	setState(newState);
		// }
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
													{question.content}
												</div>
											</span>
											<Answers
												index={index}
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
