"use client";

export default function FilesInput(
	{
		title,
		name,
		accept,
		capture,
		isMultiple = false,
		isRequired = false,
	}
) {
	return (
		<label>
			{title}
			<input
				type="file"
				multiple={isMultiple}
				accept={accept}
				capture={capture}
				name={name}
				required={isRequired}
			/>
		</label>
	);
}