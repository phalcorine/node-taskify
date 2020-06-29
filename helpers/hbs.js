// Dependencies
const moment = require("moment");
const { options } = require("../routes/auth");

module.exports = {
  editIcon: (taskUser, loggedUser, taskId, floating = true) => {
    // Return an empty string if the creator of the task
    // is not the logged in user
    console.log("Task User: ", taskUser);
    console.log("Logged User: ", loggedUser);
    if (taskUser._id.toString() !== loggedUser._id.toString()) {
      return "";
    }

    // Return a floating button link if the 'floating'
    // value is set to true
    if (floating) {
      return `<a href="/tasks/edit/${taskId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
    }

    // Return a normal link
    return `<a href="/tasks/edit/${taskId}"><i class="fas fa-edit"></i></a>`;
  },

  formatDate: (date, format) => {
    return moment(date).format(format);
  },

  htmlSelect: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },

  stripTags: (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },

  truncate: (str, len = 150) => {
    if (str.length > len && str.length > 0) {
      let newStr = str + " ";
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(""));
      newStr = newStr.length > 0 ? newStr : str.substr(0, len);

      return newStr + "...";
    }

    return str;
  },
};
