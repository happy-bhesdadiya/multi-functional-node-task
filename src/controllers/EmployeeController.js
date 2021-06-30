exports.employee_dashboard_get = async (req, res) => {
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
    res.render('admin-views/employee_dashboard', { user_name, user_role, greetings });
  } catch (err) {
    res.send(err)
  }  
}

exports.dashboard_get = (req, res) => {

  const name = req.user.fullname;
  const email = req.user.email;

  res.render('admin-views/dashboard', { name, email });
}