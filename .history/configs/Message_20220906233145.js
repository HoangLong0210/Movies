module.exports = {
  movie: {
    movie_pk: "ID phim bị trùng",
    not_found: "Tên phim không tồn tại",
    missing_title: "Thiếu tên phim",
    missing_slug: "Thiếu slug phim",
    missing_poster: "Thiếu poster ",
    poster_invalid: "Ảnh bìa không đúng định dạng",
    missing_releaseMovie: "Thiếu năm phát hành phim",
    missing_urlTrailer: "Thiếu dường dẫn trailer phim",
    missing_typeMovie: "Thiếu loại phim",
    missing_rating: "Thiếu đánh giá phim",
    missing_poster: "Thiếu poster phim",
    missing_statusMovie: "Thiếu trạng thái phim",
    add_success: "Thêm thành công",
    update_success: "Cập nhật thành công",
    rating_constraint: "Đánh giá phim từ 0 đến 10",
    typeService_constraint: "Loại dịch vụ chỉ gồm 'Miễn Phí' và 'Có Phí'",
    typeMovie_constraint: "Loại phim chỉ gồm 'Phim lẻ' và 'Phim Bộ'",
    statusMovie_constraint:
      "Trạng thái phim chỉ gồm 'Sắp công chiếu', 'Đang chiếu' và 'Đã chiếu'",
  },
  genre: {
    genre_pk: "ID thể loại phim bị trùng",
    not_found: "Thể loại này không tồn tại",
    missing_title: "Thiếu tên thể loại",
    update_success: "Cập nhật thành công",
    delete_success: "Xóa thành công",
  },
  episode: {
    not_found: "Tập phim không tồn tại",
  },
  viewer: {
    viewer_pk: "ID người dùng bị trùng",
    account_viewer_fk: "Tài khoản không tồn tại",
    email_viewer_constraint: "Email người dùng bị trùng",
    not_found: "Tên người dùng không tồn tại",
    username_required: "Yêu cầu cung cấp số điện thoại",
    username_invalid: "Số điện thoại không hợp lệ",
    followed_movie: "Đã follow phim",
    can_not_follow_movie: "Không thể follow phim",
    unfollowed_movie: "Đã unfollow phim",
    can_not_unfollow_movie: "Không thể unfollow phim",
    account_locked: "Tài khoản này đã bị khóa",
    phone_invalid: "Số điện thoại không phù hợp",
    phone_required: "Yêu cầu cung cấp số điện thoại",
    password_required: "Yêu cầu cung cấp mật khẩu",
    incorrect_account: "Tên đăng nhập hoặc mật khẩu không đúng",
    login_success: "Đăng nhập thành công",
  },
  manager: {
    manager_pk: "ID người này bị trùng",
    account_manager_fk: "Tài khoản không tồn tại",
  },
  person: {
    person_pk: "ID người này bị trùng",
    not_found: "Không tìm thấy người này",
  },
  comment: {
    comment_pk: "Thông báo này đã tồn tại",
    viewer_comment_fk: "Người xem này không tồn tại",
    movieid_comment_fk: "Phim này không tồn tại",
    reply_constraint: "Comment gốc không tồn tại",
    not_found: "Không tìm thấy comment",
  },
  file: {
    not_exist: "Tên file không tồn tại",
  },
  auth: {
    unauthorized: "Cần tài khoản để thực hiện chức năng này",
    token_invalid: "Token không khả dụng",
    forbidden: "Tài khoản không được phép thực hiện chức năng này",
  },
  encypt: {
    password_required: "Yêu cầu nhập password",
  },
  service: {
    service_pk: "ID bị trùng",
  },
};
