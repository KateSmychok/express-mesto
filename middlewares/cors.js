const cors = (req, res, next) => {
  const allowedCors = [
    'http://even-star.students.nomoredomains.monster',
    'https://even-star.students.nomoredomains.monster',
  ];
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};

export default cors;
