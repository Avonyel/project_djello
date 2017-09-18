export const SET_USER = "SET_USER";
export const SET_BOARDS = "SET_BOARDS";
export const REMOVE_BOARD = "REMOVE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const ADD_LIST = "ADD_LIST";
export const REMOVE_LIST = "REMOVE_LIST";

export const setUser = data => ({
	type: SET_USER,
	data: data
});

export const setBoards = data => ({
	type: SET_BOARDS,
	data: data
});

export const addBoard = data => ({
	type: ADD_BOARD,
	data: data
});

export const removeBoard = id => ({
	type: REMOVE_BOARD,
	data: id
});

export const addList = (boardId, list) => ({
	type: ADD_LIST,
	data: { boardId: boardId, list: list }
});

export const removeList = id => ({
	type: REMOVE_LIST,
	data: id
});

export const loginUser = (email, password) => async dispatch => {
	try {
		console.log("In loginUser");
		const loginParams = {
			email: email,
			password: password
		};

		const response = await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(loginParams)
		});

		const parsedResponse = await response.json();

		dispatch(setBoards(parsedResponse.boards));
		dispatch(setUser(parsedResponse.user));
	} catch (error) {
		console.log(error);
	}
};

export const createBoard = userId => async dispatch => {
	try {
		const response = await fetch("/api/boards/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ userId })
		});
		const newBoard = await response.json();
		newBoard.Lists = [];
		dispatch(addBoard(newBoard));
	} catch (error) {
		console.log(error);
	}
};

export const deleteBoard = id => async dispatch => {
	try {
		await fetch("/api/boards/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id })
		});

		dispatch(removeBoard(id));
	} catch (error) {
		console.log(error);
	}
};

export const createList = (boardId, boardIndex) => async dispatch => {
	try {
		const response = await fetch("/api/lists/new", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ boardId, boardIndex })
		});

		const newList = await response.json();
		newList.Cards = [];
		dispatch(addList(boardId, newList));
	} catch (error) {
		console.log(error);
	}
};

export const deleteList = id => async dispatch => {
	try {
		await fetch("/api/lists", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});

		dispatch(removeList(id));
	} catch (error) {
		console.log(error);
	}
};
