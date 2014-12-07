Template[getTemplate('comment_form')].events({
    'submit .comment-form': function(e, instance) {
        var $commentForm = instance.$('#comment');
        e.preventDefault();
        var content = $commentForm.val();

        var problem = Problems.findOne();

        Meteor.call('comment', problem._id, null, content, function(error, newComment) {
            if (error) {
                console.log(error);
            } else {
                $commentForm.val('');
                //Disable the button for a short while. Prevent spamming...
                $('.comment-form button').prop('disabled', true)
                Meteor.setInterval( function() {
                    $('.comment-form button').prop('disabled', false)
                }, 20000);
            }
        });

    }/*,
    'click #preview': function(e, instance) {
        var $commentForm = instance.$('#comment');
        var content = $commentForm.val();
        console.log(marked(content));
    }*/
});