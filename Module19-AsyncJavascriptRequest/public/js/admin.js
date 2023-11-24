$(function () {
  $(".submit.button").on("click", function () {
    const productId = $(this).parent().find("[name='prodId']").val();
    const csrf = $(this).parent().find("[name='_csrf']").val();

    const productElement = $(`tr[data-product-id="${productId}"`);
    console.log(productId);
    console.log(csrf);
    console.log(productElement);
 
    fetch(`/admin/product/${productId}`, {
      method: "delete",
      headers: {
        "csrf-token": csrf,
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.code === 0) {
          productElement.remove();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
