# File Uploads & Downloads

## npm dependencies

- npm i -S multer

## Operations

1. add form attribute `enctype="multipart/form-data"`
2. app.js

```javascript
const multer = require("multer");
app.use(multer().single(`image`));

app.use("/images", express.static(path.join(__dirname, "images")));
```

3. getInvoice

```javascript
module.exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No order found!"));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);
    fs.readFile(invoicePath, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename='" + invoicePath + '"'
      );
      return res.send(data);
    });
  });
};
```

4. use stream to download pdf file

```javascript
const file = fs.createReadStream(invoicePath);
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "inline; filename='" + invoicePath + '"');
file.pipe(res);
```

5. use pdfkit to generate a pdf file

```javascript
const pdfDoc = new PDFDocument();
pdfDoc.pipe(fs.createWriteStream(invoicePath));
pdfDoc.pipe(res);

pdfDoc.fontSize(26).text("Invoice", {
  underline: true,
});
pdfDoc.fontSize(14).text("------------------------------");

let totalPrice = 0;
order.products.forEach((prod) => {
  totalPrice += prod.quantity * prod.product.price;
  pdfDoc
    .fontSize(14)
    .text(`${prod.product.title} - ${prod.quantity} x ${prod.product.price}`);
});

pdfDoc.text("---------------");
pdfDoc.fontSize(20).text(`Total price: ${totalPrice}`);
pdfDoc.end();
```

6. modify order template file

```pug
table.ui.celled.structured.table
    thead
        tr
            th OrderId
            th ProductTitle
            th Quantity
            th Invoice
    tbody
        for order of orders
            each product, index in  order.products
                tr
                    if order.products.length > 1
                        if index === 0
                            td(rowspan=order.products.length) # #{order._id}
                            td #{product.product.title}
                            td #{product.quantity}
                            td(rowspan=order.products.length)
                                a(href=`/orders/${order._id}`) Invoice

                        else
                            td #{product.product.title}
                            td #{product.quantity}


                    else
                        td # #{order._id}
                        td #{product.product.title}
                        td #{product.quantity}
                        td
                            a(href=`/orders/${order._id}`) Invoice
```
