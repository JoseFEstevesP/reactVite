import toast from 'react-hot-toast';

interface HandleErrorParams {
	error: Record<string, unknown>;
	setError?: (
		field: string,
		options: { type: string; message: string },
	) => void;
}

export const processErrorResponse = ({
	error,
	setError,
}: HandleErrorParams) => {
	const errorKeys = Object.keys(error);

	if (errorKeys.includes('all')) {
		errorKeys.forEach(key => {
			const errorMessage = error[key];
			if (
				errorMessage &&
				typeof errorMessage === 'object' &&
				'message' in errorMessage
			) {
				toast.error((errorMessage as { message: string }).message);
			}
		});
	} else {
		if (setError) {
			handleError({ error, setError });
		}
	}
};

export const handleError = ({
	error,
	setError,
}: {
	error: Record<string, unknown>;
	setError: (field: string, options: { type: string; message: string }) => void;
}) => {
	const errorKeys = Object.keys(error);
	errorKeys.forEach(key => {
		const errorObj = error[key];
		if (errorObj && typeof errorObj === 'object' && 'message' in errorObj) {
			setError(key, {
				type: 'manual',
				message: (errorObj as { message: string }).message,
			});
		}
	});
};
