import styled from "styled-components";
import ReactModal from "react-modal";
import { SetState } from "../utils/Protocols";
import { Button } from "./Button";
import { Form } from "./Form";
import { useState } from "react";

ReactModal.setAppElement("#root");

type ModalParams = {
	modalIsOpen: boolean;
	type: "denounceStory";
	setModalIsOpen: SetState<boolean>;
	callback?: (params: any) => any;
	closeModalOnSubmit?: boolean;
};

type ModalForm = {
	text?: string;
};

export default function Modal({
	closeModalOnSubmit = true,
	modalIsOpen,
	type,
	setModalIsOpen,
	callback,
}: ModalParams) {
	const [form, setForm] = useState({} as ModalForm);

	const modalTypeOptions = {
		denounceStory: {
			title: "Denunciar Estória",
			content: (
				<Form.Section>
					<label>
						Motivo<em>*</em>
					</label>
					<textarea
						required
						autoComplete="off"
						minLength={3}
						maxLength={200}
						placeholder="Motivo da denúncia..."
						name="text"
						value={form?.text || ""}
						onChange={handleChange}
					/>
				</Form.Section>
			),
			continueButtonText: "Denunciar",
			continueButtonFunction: handleForm,
		},
	};

	const data = modalTypeOptions[type];

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	}

	function handleForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (callback) {
			callback(form);
		}

		setForm({});

		if (closeModalOnSubmit) {
			setModalIsOpen(false);
		}
	}

	return (
		<Wrapper
			isOpen={modalIsOpen}
			onRequestClose={() => setModalIsOpen(false)}
			style={{ overlay: { zIndex: 15, backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
		>
			<FormStyle onSubmit={data.continueButtonFunction}>
				<Form.Title>{data.title}</Form.Title>

				<Form.Division margin="15px 0" />

				{data.content}

				<Buttons>
					<Button
						config={{ type: "primary-invert" }}
						onClick={() => setModalIsOpen(false)}
					>
						Cancelar
					</Button>

					<Button config={{ type: "primary" }}>
						{data.continueButtonText}
					</Button>
				</Buttons>
			</FormStyle>
		</Wrapper>
	);
}

const Wrapper = styled(ReactModal)`
	&& {
		width: 90%;
		max-width: 400px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}
`;

const FormStyle = styled(Form)`
	&& {
		width: 100%;
		max-width: 200px;
	}
`;

const Buttons = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 30px auto 0;

	@media (max-width: 450px) {
		flex-direction: column-reverse;
		justify-content: space-between;
		height: 90px;
	}
`;