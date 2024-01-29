import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	// the errorscreen is shown when a route throws an error (see App.jsx)
	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
}

