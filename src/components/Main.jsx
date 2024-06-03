import { useEffect, useState } from "react";
import styled from "styled-components";
import PostModal from "./PostModal";
import { connect } from "react-redux";
import { getArticlesAPI, updateArticleLikes, addCommentAPI, deleteArticleAPI } from "../actions"; 
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

const Main = (props) => {
  const [showModal, setShowModal] = useState("close");
  const [commentText, setCommentText] = useState("");
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    props.getArticles();
  }, []);

  useEffect(() => {
    if (props.querySearch) {
      props.searchUsers(props.querySearch);
    }
  }, [props.querySearch]);

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }

    switch (showModal) {
      case "open":
        setShowModal("close");
        break;
      case "close":
        setShowModal("open");
        break;
      default:
        setShowModal("close");
    }
  };

  const handleUserClick = (email) => {
    navigate(`/user/${email}`);
  };

  const handleLike = (articleId) => {
    props.updateArticleLikes(articleId, props.user.email);
  };

  const handleCommentSubmit = (articleId) => {
    props.addComment(articleId, commentText, props.user.email, props.user.photoURL);
    setCommentText("");
  };
  
  const toggleComments = (articleId) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
  };


  const handleDelete = (articleId) => {
    props.deleteArticle(articleId);
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href, 
      })
      .then(() => console.log('Article shared successfully'))
      .catch((error) => console.error('Error sharing article:', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };
  

  return (
    <>
      <Container>
        <Sharebox>
          <div>
            {props.user && props.user.photoURL ? (
              <img src={props.user.photoURL} alt="User" />
            ) : (
              <img src="/images/user.svg" alt="User" />
            )}
            <button
              onClick={handleClick}
              disabled={props.loading ? true : false}
            >
              Start a post
            </button>
          </div>
          <div>
            <button>
              <img src="/images/post-photo-icon.svg" alt="" />
              <span>Photo</span>
            </button>

            <button>
              <img src="/images/post-video-icon.svg" alt="" />
              <span>Video</span>
            </button>

            <button>
              <img src="/images/post-article-icon.svg" alt="" />
              <span>Article</span>
            </button>
          </div>
        </Sharebox>
        {props.articles.length === 0 ? (
          <p>There are no articles</p>
        ) : (
          <Content>
            {props.loading && <img src="/images/spin-loader.svg" />}
            {props.articles.length > 0 &&
              props.articles.map((article, key) => (
                <Article key={key}>
                  <SharedActor>
                    <a
                      onClick={() => handleUserClick(article.actor.description)}
                    >
                      <img src={article.actor.image} alt="" />
                      <div>
                        <span>{article.actor.title}</span>
                        <span>{article.actor.description}</span>
                        <span>
                          {article.actor.date.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                    <button  onClick={() => handleDelete(article.id)}
                          disabled={props.user.email !== article.actor.description}>
                      <img src="/images/ellipsis.svg" alt="" />
                    </button>
                  </SharedActor>
                  <Description>{article.description}</Description>
                  <SharedImg>
                    <a>
                      {!article.sharedImage && article.video ? (
                        <ReactPlayer width={"100%"} url={article.video} />
                      ) : (
                        article.sharedImage && <img src={article.sharedImage} />
                      )}
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <li>
                      <button>
                        <img src="/images/like-pic.svg" alt="" />
                        <span>{article.likes.count}</span>
                      </button>
                    </li>
                    <li>
                      <button>
                      <img src = "/images/comment-image.svg"/>
                      <a>{article.comments.length}</a>
                      </button>
                    </li>
                  </SocialCounts>
                  <SocialActions>
                    <button onClick={() => handleLike(article.id)}>
                      <img src="images/like-icon.svg" alt="" />
                      <span>Like</span>
                    </button>

                    <button onClick={() => toggleComments(article.id)}>
                      <img src="/images/comments-icon.svg" alt="" />
                      <span>Comment</span>
                    </button>

                    <button onClick={() => handleShare(article)}>
                      <img src="/images/share-icon.svg" alt="" />
                      <span>Share</span>
                    </button>
                  </SocialActions>
                  {expandedArticleId === article.id && (
                    <CommentSection>
                      <CommentInput>
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                          onClick={() => handleCommentSubmit(article.id)}
                          disabled={commentText.trim() === ""}
                        >
                          Submit
                        </button>
                      </CommentInput>
                      <CommentsList>
                        {console.log(article.comments)}
                        {article.comments.map((comment, index) => (
                          <Comment key={index}>
                          <img src={comment.userImage} onClick={() => handleUserClick(comment.userEmail)} />
                          <div>
                            <span onClick={() => handleUserClick(comment.userEmail)}>{comment.username}</span>
                            <p>{comment.comment}</p>
                          </div>
                        </Comment>
                        ))}
                      </CommentsList>
                    </CommentSection>
                  )}
                </Article>
              ))}
          </Content>
        )}
        <PostModal showModal={showModal} handleClick={handleClick} />
      </Container>
    </>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #98c5e9;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  border: 3px solid #001838;
`;

const Sharebox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin: 0 0 8px;

  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;

      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }

      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 35px;
        background-color: white;
        text-align: left;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;

      button {
        img {
          margin: 0 4px 0 -2px;
          height: 25px;
        }

        span {
          color: #001838;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: black;
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 10px;
  top: 30px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 1;
`;

const DropdownItem = styled.button`
  display: block;
  padding: 10px 20px;
  background: white;
  border: 3px solid  #001838;
  text-align: left;
  width: 100%;
  &:hover {
    background: #f5f5f5;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;


const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: black;
  font-size: 14px;
  text-align: left;
`;

const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #001838;
  list-style: none;

  li {
    margin-right: 5px;
    font-size: 12px;

    button {
      display: flex;
      border: none;
      background-color: #98c5e9;
    }
  }

  img {
    height: 14px;
    margin: 2px;
  }
`;

const SocialActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;

  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #001838;
    background-color: #98c5e9;
    border: none;
    cursor: pointer;

    img {
      height: 30px;
      padding-right: 1px;
    }
    
    @media (min-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
  }
`;

const CommentSection = styled.div`
  background-color: #98c5e9;
  padding: 16px;
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  border-bottom: 2px solid black;
  padding-bottom: 10px;
  input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-right: 10px;
  }
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #0073b1;
    color: white;
    cursor: pointer;
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const CommentsList = styled.div`
  margin-top: 16px;
`;

const Comment = styled.div`
  
  text-align: left;
  margin-bottom: 15px;
  display: flex;
  div{
    border: 3px solid #001838;
    border-radius: 5px;
    width: 100%;
  }
  img{
    height: 40px;
    border-radius:50%;
    margin-right:5px;
    margin-top:5px;
    cursor: pointer;
  }
  span {
    cursor: pointer;
    font-weight: bold;
    padding: 3px;
    color: #001838;
  }
  p {
    padding: 3px;
    padding-left: 10px;
    margin: 4px 0 0;
  }
`;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.articleState.loading,
    user: state.userState.user,
    articles: state.articleState.articles,
    searchQuery: state.searchState.searchQuery,
    searchResults: state.searchState.searchResults,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getArticles: () => dispatch(getArticlesAPI()),
  updateArticleLikes: (articleId, userEmail) =>
    dispatch(updateArticleLikes(articleId, userEmail)),
  addComment: (articleId, comment, userEmail, userImage) =>
    dispatch(addCommentAPI(articleId, comment, userEmail, userImage)),
  deleteArticle: (articleId) => dispatch(deleteArticleAPI(articleId)), 
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

