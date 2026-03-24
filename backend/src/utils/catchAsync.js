/**
 * Hứng lỗi từ các hàm async để tránh dùng try-catch lặp đi lặp lại
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
