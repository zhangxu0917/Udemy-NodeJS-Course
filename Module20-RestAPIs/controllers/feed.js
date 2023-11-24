exports.getPosts = (req, res, next) => {
  res.status(200).json({
    code: 0,
    message: "This is the first post",
  });
};

exports.createPost = (req, res, next) => {
  // Create post in db
  const { title, content } = req.body;
  console.log(title, content);

  res.status(201).json({
    code: 0,
    message: "Post created successfully",
    post: {
      id: Date.now(),
      title,
      content,
    },
  });
};
