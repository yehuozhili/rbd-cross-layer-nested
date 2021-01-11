import { useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "react-beautiful-dnd";
import { Reorder, getAnswerListStyle } from "./utils";

export const InnerItem = (props: any) => {
	const { item, index: ins, action } = props;
	return (
		<Droppable
			key={item.id}
			droppableId={`${item.id}`}
			isDropDisabled={action === "inner"}
		>
			{(provided, snapshot) => {
				console.log(provided, snapshot);
				return (
					<div
						ref={provided.innerRef}
						style={getAnswerListStyle(snapshot.isDraggingOver)}
					>
						{item.children.map((v: any, index: number) => {
							return (
								<Draggable
									key={`${ins}${index}`}
									draggableId={`${ins}${index}`}
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
											<span {...provided.dragHandleProps}>
												<div style={{ float: "left" }}>{v.id}</div>
											</span>
											{v.content}
										</div>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				);
			}}
		</Droppable>
	);
};

const item = (str: string) => {
	return {
		id: str,
		content: "str" + str,
		children: [],
	};
};

const data = [item("0"), item("1"), item("2"), item("3")];

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
		// 需要找到哪个内层
		const id = result.source.droppableId; //通过id查找索引，这个id应该在某个外层的children下面，去查外层的索引
		let index = null;
		state.find((v, ins) => {
			if (v.id === id) {
				index = ins;
			}
			return v.id === id;
		});
		console.log(index, "index");
		if (index !== null) {
			return state[index].children.splice(result.source.index, 1);
		} else {
			return null;
		}
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
	console.log(addItem);
	if (target) {
		state.splice(result.destination!.index, 0, addItem);
		return state;
	} else {
		//否则是内层add
		// 此处还需要排除自己的内层。暂未实现
		let index = null;
		const id = result.destination!.droppableId;
		state.find((v, ins) => {
			if (v.id === id) {
				index = ins;
			}
			return v.id === id;
		});
		console.log(index, "addindex");
		if (index !== null) {
			return state[index].children.splice(
				result.destination!.index,
				0,
				addItem
			);
		}
		return state;
	}
};

const situationResolve = (result: DropResult, state: Array<any>) => {
	const sign = judgeResult(result);
	switch (sign) {
		case -1:
			//内层
			//先判断哪个列表
			console.log("同内层");
			// 同内层有可能是跨内层或者在同一个内层。
			// 删除时分别判断destination与source在哪个外层索引。
			const sourceid = result.source!.droppableId;
			let sourceindex: number | null = null;
			const targetid = result.destination!.droppableId;
			let targetindex: number | null = null;
			state.map((v, ins) => {
				if (v.id === sourceid) {
					sourceindex = ins;
				}
				if (v.id === targetid) {
					targetindex = ins;
				}
				return v;
			});
			console.log(sourceindex, targetindex);
			if (sourceindex === null || targetindex === null) {
				//目标元素或者拖拽元素有个不在二级嵌套内  暂不考虑此情况
				return state;
			} else {
				const [remove] = state[sourceindex].children.splice(
					result.source.index,
					1
				);
				state[targetindex].children.splice(
					result.destination!.index,
					0,
					remove
				);
				console.log(state);

				return state;
			}

		case 1:
			const source = regexp.exec(result.source.droppableId);
			const target = regexp.exec(result.destination!.droppableId);
			//先把source里的拿出来result.source.index,
			const x = toSplice(result, state, source);
			if (x) {
				const [remove] = x;
				// remove后添加进对应的destination
				console.log(remove, "remove");
				toAddItem(result, state, target, source, remove);
				return state;
			}
			// 没有删除直接返回原样
			return state;
		case 0:
			return Reorder(state, result.source.index, result.destination!.index);
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
		if (result.draggableId === result.destination.droppableId) {
			//内部嵌套
			return;
		}
		const newState = situationResolve(result, state);
		console.log(newState, "newstate");
		//setState(newState);
		if (newState) {
			setState(newState);
		}
		console.log(result.type);
	};
	return (
		<div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="wrapper"
					isDropDisabled={props.action === "top"}
				>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={{
								background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
								padding: 8,
								width: 500,
							}}
						>
							{state.map((value: any, index: number) => (
								<Draggable key={value.id} draggableId={value.id} index={index}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											style={getItemStyle(
												snapshot.isDragging,
												provided.draggableProps.style
											)}
										>
											{value.content}
											<span {...provided.dragHandleProps}>
												<div
													style={{
														float: "left",
													}}
												>
													{value.content}
												</div>
											</span>
											<InnerItem
												index={index}
												action={props.action}
												item={value}
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
