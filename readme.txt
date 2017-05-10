Please read the following to use this app appropiately:
	
	1). First of all to run the app correctly you should have the following softwares installed on your system:

			a). MongoDB
			b). Nodejs

		additionally you should also have an active internet connection to download the css, angular, jquery and bootstrap 
		files from the respective CDNs.

	2). Secondly, open terminal, cd into this file's directory and run: npm install (use sudo here if you see any errors),
		now the app can be run, just do this: make sure mongod is running and do: node start or do: node app in this directory,
		the app will run on localhost:3000.
	
	3). In the app at places where you are given an option to upload a file please upload a pdf only, for uploading other types
		of files go to ./routes/files.js and edit line 12 of this file like this: change '.pdf' string to '.<file extn>' (eg: '.jpg'),
		now upload the new type only and not of some other type. This can be fixed but might require more amount of frontend work.

	4). Please don't click (apply)/(create post) without uploading any file at places where you are given an option to upload one as
		 this will later on give you weird errors like Cannot get uploads/ or Cannot get uploads/noName. We need better frontend work
		 to test for presence of file before enabling the apply button or create post button.
	
	5). Finally you can find all the user uploaded pdf or the files of other format inside the ./public/uploads directory.

	Final comments:

	The file uploading problem:

	For uploading files people generally use a package called multer.

	The restriction on uploading only one type of file can be overcome by improving the frontend and then doing some changes with backend
	, basically the problem is the I am using multer package which stores the files by file names which do not have extentions by
	default so we have to add them separately. We can send the extention from the frontend itself to dynamically allocate extentions to files.
	Another way can be to is do something at the time of rendering the file, eg: we can get the file without the extention from the backend and 
	then add an extention later by the frontend. So, I found this problem later during testing and didn't have time to fix this.


	The app has a basic amount of frontend work but the backend is solid and thus the app can be easily scaled.
	Still there might be some errors somewhere as I didn't have enough time to test the app fully.