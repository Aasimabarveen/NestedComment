const data={
  "currentUser": {
    "image": { 
      "png": "./images/avatars/image-juliusomo.png",
      "webp": "./images/avatars/image-juliusomo.webp"
    },
    "username": "juliusomo"
  },
  "comments": [
    {
      "id": 1,
      "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      "createdAt": "1 month ago",
      "score": 12,
      "user": {
        "image": { 
          "png": "./images/avatars/image-amyrobson.png",
          "webp": "./images/avatars/image-amyrobson.webp"
        },
        "username": "amyrobson"
      },
      "replies": []
    },
    {
      "id": 2,
      "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      "createdAt": "2 weeks ago",
      "score": 5,
      "user": {
        "image": { 
          "png": "./images/avatars/image-maxblagun.png",
          "webp": "./images/avatars/image-maxblagun.webp"
        },
        "username": "maxblagun"
      },
      "replies": [
        {
          "id": 3,
          "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          "createdAt": "1 week ago",
          "score": 4,
          "replyingTo": "maxblagun",
          "user": {
            "image": { 
              "png": "./images/avatars/image-ramsesmiron.png",
              "webp": "./images/avatars/image-ramsesmiron.webp"
            },
            "username": "ramsesmiron"
          }
        },
        {
          "id": 4,
          "content": "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          "createdAt": "2 days ago",
          "score": 2,
          "replyingTo": "ramsesmiron",
          "user": {
            "image": { 
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          }
        }
      ]
    }
  ]
};
let maxId = data.comments.reduce((max, comment) => (comment.id > max ? comment.id : max), 0);
let count=maxId;
function formatDate(commentdate){
	var currentDate = new Date();
	var yourDate = new Date(commentdate);
	var minute = 60 * 1000;
	var hour = 60 * minute;
	var day = 24 * hour;
	var week = 7 * day;
	var label;
	var timeDifference = currentDate - yourDate;
	if (timeDifference < minute) {
	    label = "now";
	} else if (timeDifference < hour) {
	    var minutesAgo = Math.floor(timeDifference / minute);
	    label = minutesAgo + " minute" + (minutesAgo > 1 ? "s" : "") + " ago";
	} else if (timeDifference < day) {
	    var hoursAgo = Math.floor(timeDifference / hour);
	    label = hoursAgo + " hour" + (hoursAgo > 1 ? "s" : "") + " ago";
	} else if (timeDifference < week) {
	    var daysAgo = Math.floor(timeDifference / day);
	    label = daysAgo + " day" + (daysAgo > 1 ? "s" : "") + " ago";
	} else {
	    label = "more than 1 week ago";
	}

	return label;

}

function setData(data,template){
	let {id,createdAt,content,score,user:{username,image:{png}},replies}=data;
	let currentUser=sessionStorage.getItem('currentuser');
	const clonedComment = template.content.cloneNode(true);		
	let child=clonedComment.querySelector(".comment_template");
	child.id=id;
	let scorediv=child.querySelector(".score_value");
	scorediv.textContent=score;
	child.querySelector(".name").textContent=username;
	child.querySelector(".time").textContent=createdAt;
	child.querySelector(".comment_value").textContent=content;
	child.querySelector(".profile_pic").src=png;
	if(username.toLowerCase()===currentUser.toLowerCase()){
		child.querySelector(".you_tag").classList.toggle("hide");
		child.querySelector(".delete").classList.toggle("hide");
		child.querySelector(".edit").classList.toggle("hide");
		child.querySelector(".reply_btn").classList.add("hide");
	
	}
	// child.querySelector(".delete").onclick=deleteComment(child);
	return clonedComment;
};

function createdata(parent) {
	count+=1;
	let commentDate=new Date();
	let date=formatDate(commentDate);
	let user_name=sessionStorage.getItem('currentuser');
	let input_img=document.querySelector(".input_box").querySelector("img").src;
	let new_comment=document.querySelector(".input_box").querySelector("#new_comment");
	
	let data={
		      "id": count,
		      "replyingTo":parent.querySelector(".name").textContent,
		      "content": new_comment.value,
		      "createdAt": date,
		      "score": 0,
		      "user": {
		        "image": { 
		          "png": input_img
		        },
		        "username": user_name
		      }
				}
	return data;
}

function addreply(reply,id,template) {
	let {user:{username},replyingTo,content}=reply;
	let replyto="<span class=replyto>@"+replyingTo+" </span>";
	count+=1;
	child=setData(reply,template);
	child.querySelector(".comment_value").innerHTML=replyto+content;
	let currentUser=sessionStorage.getItem('currentuser');
	let replydiv=document.getElementById(id).querySelector(".reply_section");
	replydiv.appendChild(child);
	deleteComment();
	updatecomment();
	let edit=document.querySelectorAll(".edit");
	edit.forEach(btn=>{
  		btn.addEventListener("click",()=>{
  			editcomment(btn);
  		});
  	});
}

function sample() {
	console.log("delete clicked");
}

function addComment(dataObj,container,template){
	dataObj.forEach((data)=>{
		let child=setData(data,template);
		let {id,replies}=data;
		container.appendChild(child);
		if(replies.length>0)
		{
			replies.forEach((reply)=>{
				addreply(reply,id,template);
			});
		}
		
	});
	addInputTemplate(container,null);
}

function addInputTemplate(container,reply,template) {
	let input_template=document.querySelector(".input_template");
	const input_template_clone=input_template.content.cloneNode(true);
	let input=document.querySelector(".input_box");
	if(input)
		input.classList.add("hide");
	if(reply)
	{	
		let replybtn=input_template_clone.querySelector(".submit");
		replybtn.textContent="Reply";
		let replyto="@"+container.querySelector(".name").innerHTML+", ";
		container.insertBefore(input_template_clone,reply);
		let new_comment=document.querySelector(".input_box").querySelector("#new_comment");
		new_comment.value=replyto;
		replybtn.addEventListener("click",()=>{
			if(new_comment.value){
				let c=new_comment.value.toString().split(" ");
				var filteredWords = c.filter(function (word) {
			    	return word.trim() !== replyto.trim();
			  	});
			  	filteredWords.join(' ');
			  	new_comment.value=filteredWords;
				let data=createdata(container);
				addreply(data,container.id,template);	
				container.removeChild(container.querySelector(".input_box"));	
				input.classList.remove("hide");
			}
			else
				alert("please Provide Your Comment");
		});
	}
	else{
		container.appendChild(input_template_clone);
	}
}

function addnewcomment(parent,template){
	let user_name=sessionStorage.getItem('currentuser');
	let input_img=document.querySelector(".input_box").querySelector("img").src;
	let new_comment=document.querySelector(".input_box").querySelector("#new_comment");
	let commentDate=new Date();
	let date=formatDate(commentDate);
	count+=1;	
	if(new_comment.value){
		let data=createdata(parent);
		let newcomment=setData(data,template);
		var lastChild = parent.lastElementChild;
		
		parent.insertBefore(newcomment,lastChild);
		new_comment.value="";
		deleteComment();
		addScore();
		minusScore();
		updatecomment();
		console.log(newcomment);
		let edit=document.querySelectorAll(".edit");
		edit.forEach(btn=>{
  		btn.addEventListener("click",()=>{
  			editcomment(btn);
  		});
  	});

	}
	else{
		alert("Please Provide Your Comment!");
	}
		
}

function deleteComment(){
	console.log("Im clicked** "+child);
	let del=document.querySelectorAll(".delete");
		del.forEach(del_btn=>{
		del_btn.addEventListener("click",()=>{
			const result = findParent(del_btn.parentNode);
			document.querySelector(".modal").classList.remove("hide");
			let yes=document.querySelector(".modal").querySelector(".delete_btn");
			let no=document.querySelector(".modal").querySelector(".cancel");
			no.addEventListener("click",()=>{
				document.querySelector(".modal").classList.add("hide");
			});
			yes.addEventListener("click",()=>{
				if(document.getElementById(result.id)){
					document.getElementById(result.id).remove();
					document.querySelector(".modal").classList.add("hide");
				}
			});
		});
			
	});
	// });
	
}

function findParent(child){
	let lastParentNode=null;
	let currentNode = child;
	while (currentNode !== null) {
	  if (currentNode.hasAttribute('id')) {
	    lastParentNode = currentNode;
	    break;
	  }
	  currentNode = currentNode.parentNode;
	}
	return lastParentNode;
}

function addScore(){
	console.log("im increasing for");
	let add=document.querySelectorAll(".plus");
	add.forEach(add_btn=>{
		add_btn.addEventListener("click",()=>{
			console.log(add_btn);
			let parent=findParent(add_btn);
			let score=parent.querySelector(".score_value").textContent;
			score=parseInt(score)+1;
			parent.querySelector(".score_value").textContent=score;
			return;
		});
	});
}

function minusScore(){
	let minus=document.querySelectorAll(".minus");
	minus.forEach(minus_btn=>{
		minus_btn.addEventListener("click",()=>{
			let parent=findParent(minus_btn);
			let score=parent.querySelector(".score_value").textContent;
			score=parseInt(score)-1;
			if(score<0) score=0;
			parent.querySelector(".score_value").textContent=score;
			return;
		});
	});
}

function updatecomment() {
	let updatebtn=document.querySelectorAll(".update");
	updatebtn.forEach(btn=>{
		btn.addEventListener("click",()=>{
			let parent=findParent(btn);
			parent.querySelector(".update").classList.add("hide");
			parent.querySelector(".comment_value").contentEditable=false;
			
		});
	});	
}

function editcomment(btn) {
	let parent=findParent(btn);
	parent.querySelector(".update").classList.remove("hide");
	parent.querySelector(".comment_value").contentEditable=true;
	parent.querySelector(".comment_value").focus();
}

document.addEventListener("DOMContentLoaded",()=>{
	let template=document.querySelector(".comment_hood");
	let modal=document.querySelector(".modal");
	let container=document.querySelector(".container");
	container.appendChild(modal);
	const clonedComment3 = template.content.cloneNode(true);
	let {currentUser:{username},comments}=data;
	sessionStorage.setItem('currentuser', username);	
	addComment(comments,container,template);
	let submit=document.querySelector(".submit");
	let reply=document.querySelectorAll(".reply_btn");
	let delete_cmnt=document.querySelectorAll(".delete");
	let add=document.querySelectorAll(".plus");
	let minus=document.querySelectorAll(".minus");
	let edit=document.querySelectorAll(".edit");
	let update=document.querySelectorAll(".update");

	submit.addEventListener("click",()=>{
		addnewcomment(container,template);
	});
	
	reply.forEach(reply_btn => {
		  reply_btn.addEventListener('click', () => {
		  	console.log(reply_btn);
		  const result = findParent(reply_btn);
		  let replybefore=result.querySelector(".reply_section");
		  addInputTemplate(result,replybefore,template);
  		});
	});

	delete_cmnt.forEach(btn => {
		  btn.addEventListener('click', () => {
		  	deleteComment();
  		});
	});
	updatecomment();
	addScore();
	minusScore();
  	edit.forEach(btn=>{
  		btn.addEventListener("click",()=>{
  			editcomment(btn);
  		});
  	});
});
