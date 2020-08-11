import React from 'react'
import {Image, Grid, Form, Button, Message} from 'semantic-ui-react'
import axios from 'axios'
import querystring from 'querystring'

import '../style/profile.css'

class Messageonsent extends React.Component{
    constructor(props){
        super(props)
    }
    render() {
        return(<>
            {this.props.msg ? <Message success header='Username Updated' content='Please Reload'/> : <Message error header='Username Update Failed' content='Invalid Input'/>}
            </>
            )
    }
}

class Profile extends React.Component{
    constructor(props){
        super(props)
        this.state={user:{}, value:'', msg:'', userid : '', show:false}
    }
    componentDidMount(){

        axios.get('profile/user').then( user => {
            this.setState({userid:user.data.userid})

            axios.get('profile/profile?'+querystring.stringify({'slug' : user.data.id})).then( response =>{
                this.setState({user:response.data})
            })
        }).catch( error =>{
            window.location = '/mypage/home'
            
        })
    }

    handleChange = (e) =>{
        this.setState({value: e.target.value})
    }
    
    handleSubmit = (e) => {
        
        axios.patch('user/'+this.state.userid+'/', {username : this.state.value}).then(res => {
            this.setState({value:'', msg:true, show : true})
        }).catch( error => {
            this.setState({value:'', msg:false, show:true})
        
        })
    }

    render(){
        let date = new Date(this.state.user.date_joined)
        let profilecard = <>
        <div className='profilecard'>
            <Grid columns={2} divided stackable textAlign='center'>
                <Grid.Row>
                    <Grid.Column>
                        <Image src={this.state.user.display_picture} circular size='small'/>
                    </Grid.Column>
                    <Grid.Column>
                        <div className='data-profile'>
                            {this.state.user.fname ? this.state.user.fname : <i>F_Name</i>} {this.state.user.lname ? this.state.user.lname : <i>L_Name</i>}<br/>
                            @{this.state.user.username}<br/>
                            {this.state.user.email}<br/>
                            {this.state.user.enr}<br/>
                            <i>Joined : {date.toDateString()}</i><br/>
                            { this.state.user.admin && <b>Admin</b>}<br/>
                            { this.state.user.disabled && <b>Disabled</b>}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
        <Form>
        <Form.Group style={{marginTop : '20px'}} widths='4'>
            
            <Form.Input fluid placeholder='Change Username' value={this.state.value} onChange={this.handleChange} /><span>&nbsp;&nbsp;</span><Button color='blue' onClick={this.handleSubmit}>Patch</Button>
        </Form.Group>
        </Form>
        { this.state.show && <Messageonsent msg = {this.state.msg}/>}
    </>

        return(
            profilecard
        
        )
    }
}


export default Profile