/*

 ----------------------------------------------------------------------------
 | fhir-mpi: Demonstration QEWD-Up FHIR-based MPI MicroService              |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  12 March 2019

*/

module.exports = function(args, finished) {
  let query = args.req.query;
  if (query.value === '') {
    return finished({error: 'Search value was not defined'});
  }
  
  let params = {};
  let patientIndex = this.db.use('PatientIndex', query.type, query.value);
  
  if (query.type === 'by_age') {
    const date = new Date();
    const from = date.getFullYear() - query.from +1;
    const to = date.getFullYear() - query.to;
    
    params = {
      range: {
        from: `${to}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
        to: `${from}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      }
    };
    patientIndex = this.db.use('PatientIndex', 'by_birthdate');
  }
  
  const fhir = {
    resourceType: 'Bundle',
    entry: []
  };
  
  const patientDoc = this.db.use('Patient', 'by_id');
  
  patientIndex.forEachChild(params, function(id, node) {
    const identifier = query.type === 'by_age' &&  node.firstChild.name ? node.firstChild.name : id;
    const patient = patientDoc.$(identifier).getDocument(true);
    fhir.entry.push({
      resource: patient
    });
  });
  
  finished(fhir);
};
