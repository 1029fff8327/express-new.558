module.exports = (req, res, next) => {
	let fileBuffer = Buffer.from('');
  
	req.on('data', chunk => {
	  fileBuffer = Buffer.concat([fileBuffer, chunk]);
	});
  
	req.on('end', () => {
	  console.log('Received file content in middleware:', fileBuffer.toString('utf-8'));
	  
	  if (!fileBuffer || !fileBuffer.length) {
		console.error('Error: Empty or invalid file received in middleware');
		return res.status(400).json({ error: 'Invalid file provided in middleware' });
	  }
  
	  req.file = {
		data: fileBuffer,
		mimetype: req.headers['content-type'],
		size: req.headers['content-length'],
		meta: {
		  originalname: 'your_default_filename.txt',
		},
	  };
  
	  next();
	});
  };
  