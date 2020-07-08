export default (isPrevent, tags = ['html']) => {
  const method = isPrevent ? 'add' : 'remove';

  tags.forEach(tag =>
    document.getElementsByTagName(tag)[0].classList[method]('preventScroll')
  );
};
