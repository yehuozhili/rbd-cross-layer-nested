import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getItemStyle, getAnswerListStyle } from "./utils";

export const Answers = (props: any) => {
	const { question, questionNum, action } = props;
	return (
		<Droppable
			droppableId={`droppable${question.id}`}
			type={`hello`}
			isDropDisabled={action === "inner"}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					style={getAnswerListStyle(snapshot.isDraggingOver)}
				>
					{question.children.map((answer: any, index: number) => {
						return (
							<Draggable
								key={`${questionNum}${index}`}
								draggableId={`${questionNum}${index}`}
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
											<div style={{ float: "left" }}>
												answer
											</div>
										</span>
										{answer}
									</div>
								)}
							</Draggable>
						);
					})}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default Answers;
