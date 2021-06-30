const { validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const getUserFromCookie = require('../utils/getUser');

exports.admin_dashboard_get = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;

    let curDate = new Date();
    curDate = curDate.getHours();

    let greetings = '';

    if (curDate >= 1 && curDate < 12) {
      greetings = 'Good Morning..!'
    } else if (curDate >= 12 && curDate < 19) {
      greetings = 'Good Afternoon..!'
    } else {
      greetings = 'Good Night..!'
    }

    res.render('admin-views/admin_dashboard', { user_name, user_role, greetings });
  } catch (err) {
    res.send(err)
  }
}

exports.view_employee_get = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;

    await User.find({ role: "employee" } , (err, docs) => {
      if (!err) {
        res.render('admin-views/employee/view_employee', { user_name, user_role, employees: docs });
      } else {
        res.send('Error in retrieving employee list :' + err);
      }
    });
  } catch (err) {
    res.send(err);
  }
}

exports.view_product_get = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;

    const search = req.query.sort_product;
    if (search) {
      let data = {};
      // const data = await Product.find({}, { sort: {search:-1}});
      // console.log(data);
      if (search === 'Name' || search === 'name' || search === 'NAME') {
        data = { product_name: 1 };
      } 
      if (search === 'Price' || search === 'price' || search === 'PRICE'){
        data = { product_price: 1 };
      }
      if (search === 'Stock' || search === 'stock' || search === 'STOCK'){
        data = { product_stock: 1 };
      }
      
      Product.find({}, null, { sort: data },(err, docs) => {
        if (!err) {
          res.render('admin-views/product/view_product', { user_name, user_role, products: docs });
        } else {
          res.send('Error in retrieving employee list :' + err);
        }
      });
    } else {
      await Product.find((err, docs) => {
        if (!err) {
          res.render('admin-views/product/view_product', { user_name, user_role, products: docs });
        } else {
          res.send('Error in retrieving employee list :' + err);
        }
      });
    }

  } catch (err) {
    res.send(err);
  }
}

exports.view_product_post = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;

    const search = req.body.search_product;
    
    await Product.find({ $or: [ { product_name: { $regex: search, $options: '$i' } } ] }, (err, docs) => {
      if (!err) {
        res.render('admin-views/product/view_product', { user_name, user_role, products: docs });
      } else {
        res.send('Error in retrieving employee list :' + err);
      }
    });
  } catch (err) {
    res.send(err);
  }
}

exports.add_product_get = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;
  
    res.render('admin-views/product/add_product', { user_name, user_role });
  } catch (err) {
    res.send(err);
  }
}

exports.add_product_post = async (req, res) => {
  try {
    const user = await getUserFromCookie(req, res);
    const user_name = await user.fullname;
    const user_role = await user.role;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();
      console.log(alert);
      res.render('admin-views/product/add_product', { user_name, user_role, alert });
    } else {
  
      const { product_name, product_price, product_stock, is_available } = req.body;
      
      const product = new Product({
        product_name: product_name,
        product_price: product_price,
        product_stock: product_stock,
        product_img: req.file.filename,
        is_available: is_available
      })
      
      await product.save();
    
      req.flash('success', 'Product added successfully!');
      res.render('admin-views/product/add_product', { user_name, user_role, success_message: req.flash('success') });
    }

  } catch (err) {
    res.send(err);
  }
}

exports.edit_product_get = async (req, res) => {
  try {
    const user_name = await req.user.fullname;
    const user_role = await req.user.role;

    Product.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("admin-views/product/edit_product", {
          product: doc, user_name, user_role
        });
      }
    })
  } catch (err) {
      res.send(err);
  }
}

exports.edit_product_post = async (req, res) => {
  try {
    const user = await getUserFromCookie(req, res);
    const user_name = await user.fullname;
    const user_role = await user.role;
    
    const { product_name, product_price, product_stock, is_available } = req.body;

    const updates = { product_name, product_price, product_stock, is_available };

    if (req.file) {
      const image = req.file.filename;
      updates.product_img = image;
    }

    Product.findOneAndUpdate({ _id: req.body._id }, updates, { new: true }, (err, doc) => {
      if (!err) {
        console.log(doc);
        req.flash('success', 'Product Updated successfully!');
        res.render('admin-views/product/edit_product', { success_message: req.flash('success'), product: doc, user_name, user_role });
      }
      else {
        res.render("admin-views/product/edit_product", {
          product: req.body
        })
      }
    })

  } catch (err) {
      res.send(err);
  }
}

exports.delete_product_get = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/view-product');
      } else {
          res.send('Error in Product delete :' + err);
      }
    })
  } catch (err) {
      res.send(err);
  }
}