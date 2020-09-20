

module.exports = (req, res) =>{
    var UI = `
    <a class="header1 left" href ="/">홈</a> 
    <a class="header1 left" href ="/jonver">jonver</a>
    <a class="header1 left" href ="/board/1">게시판</a>
    `;
    if(req.user){
        UI += `<a class="header1 right" href ="/auth/logout">로그아웃</a><span class="header1 right">${req.user}</span>`;
    }
    else{
        UI += `<a class="header1 right" href ="/auth/newaccount">회원가입</a><a class="header1 right" href ="/auth/login">로그인</a>`;
    }
    UI+=`<br><br><br><br><hr>`
    return UI;
}