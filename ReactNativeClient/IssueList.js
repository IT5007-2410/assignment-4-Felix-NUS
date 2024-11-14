import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {Picker} from '@react-native-picker/picker';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
    Keyboard
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text>Placeholder for IssueFilter</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 5, paddingTop: 10, backgroundColor: '#fff' },
  header: { flex:1, height: 30, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = [
        issue.id, issue.status, issue.owner, issue.created ? issue.created.toDateString() : '', issue.effort, issue.due ? issue.due.toDateString():'', issue.title
    ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row data={rowData} widthArr={width} style={styles.row} textStyle={styles.text}/>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = ['ID', 'Status', 'Owner', 'Created', 'Effort', 'Due', 'Title'];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
      <ScrollView horizontal={true}>
        <View style={styles.container}>
        {/****** Q2: Start Coding here to render the table header/rows.**********/}
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row data={tableHeader} widthArr={width} style={styles.header} textStyle={styles.text}/>
            <TableWrapper style={styles.wrapper}>
              {issueRows}
            </TableWrapper>
          </Table>
        {/****** Q2: Coding Ends here. ******/}
        </View>
    </ScrollView>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {owner: '', title: '', status: 'New', effort: 1};
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setOwner(newOwner) {
      this.setState({owner: newOwner});
    }
    setTitle(newTitle) {
      this.setState({title: newTitle});
    }
    setStatus(newStatus) {
      this.setState({status: newStatus});
    }
    setEffort(newEffort) {
      this.setState({effort: newEffort});
    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const issue = {
        owner: this.state.owner,
        title: this.state.title,
        status: this.state.status,
        effort: this.state.effort,
        due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
      };
      this.props.createIssue(issue);
      this.ownerInput.clear();
      this.titleInput.clear();
      this.state.status = 'New';
      this.effortInput.clear();
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput ref={(input) => { this.ownerInput = input; }} placeholder="Owner" onChangeText={(newOwner) => this.setOwner(newOwner)} />
          <TextInput ref={(input) => { this.titleInput = input; }} placeholder="Title" onChangeText={(newTitle) => this.setTitle(newTitle)} />
          <Text>Status</Text>
          <Picker
              selectedValue={this.state.status}
              onValueChange={(itemValue) => this.setState({ status: itemValue })}
              style={styles.input}
          >
              <Picker.Item label="New" value="New" />
              <Picker.Item label="Assigned" value="Assigned" />
              <Picker.Item label="Fixed" value="Fixed" />
              <Picker.Item label="Closed" value="Closed" />
          </Picker>
          <TextInput ref={(input) => { this.effortInput = input; }} keyboardType='numeric' placeholder="Effort" onChangeText={(newEffort) => this.setEffort(newEffort)} />
          <Button onPress={this.handleSubmit} title="Add Issue" />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name: ''};
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newName) {
      this.setState({name: newName});
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query = `mutation myaddToBlacklist($newName: String!) {
        addToBlacklist(nameInput: $newName)
    }`;
    const newName = this.state.name;
    console.log(newName);
    const data = await graphQLFetch(query, {newName});
    this.newNameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput ref={(input) => { this.newNameInput = input; }} placeholder="Name To Blacklist" onChangeText={(newName) => this.setName(newName)} />
          <Button onPress={this.handleSubmit} title="Add to Blacklist" />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/****** Q1: Start Coding here. ******/}
        <IssueFilter/>
        {/****** Q1: Code ends here ******/}


        {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues}/>
        {/****** Q2: Code ends here ******/}

        
        {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue}/>
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        <BlackList/>
        {/****** Q4: Code Ends here. ******/}
      </ScrollView>
    </SafeAreaView>
      
    );
  }
}
