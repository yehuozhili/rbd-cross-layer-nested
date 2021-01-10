import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Reorder, getItemStyle, getQuestionListStyle } from "./utils";
import Answers from "./answer";

// fake data generator
const getQuestions = (count: number) =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `question-${k}`,
		content: `question ${k}`,
		answers: [`answer-1`, `answer-2`, `answer-3`],
	}));

class Questions extends Component<any, any> {
	constructor(props: any) {
		super(props);

		console.log(getQuestions(3));

		this.state = {
			questions: getQuestions(4),
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	onDragEnd(result: any) {
		// dropped outside the list
		console.log(result);
		if (!result.destination) {
			//console.log("no-change");
			return;
		}
		console.log(result.type);
		if (result.type === "QUESTIONS") {
			console.log(JSON.stringify(this.state.questions));
			const questions = Reorder(
				this.state.questions,
				result.source.index,
				result.destination.index
			);
			console.log(questions);
			this.setState({
				questions,
			});
		} else {
			const answers = Reorder(
				this.state.questions[parseInt(result.type, 10)].answers,
				result.source.index,
				result.destination.index
			);

			const questions = JSON.parse(JSON.stringify(this.state.questions));

			questions[result.type].answers = answers;

			this.setState({
				questions,
			});
		}
	}

	onDragUpdate(e: any) {
		console.log("update", e);
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<DragDropContext
				onDragEnd={this.onDragEnd}
				onDragUpdate={this.onDragUpdate}
			>
				<Droppable droppableId="droppable" type="QUESTIONS">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={getQuestionListStyle(
								snapshot.isDraggingOver
							)}
						>
							{this.state.questions.map(
								(question: any, index: number) => (
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
													provided.draggableProps
														.style
												)}
											>
												{question.content}
												<span
													{...provided.dragHandleProps}
												>
													<div
														style={{
															float: "left",
														}}
													>
														+++
													</div>
												</span>
												<Answers
													questionNum={index}
													question={question}
												/>
											</div>
										)}
									</Draggable>
								)
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

export default Questions;
