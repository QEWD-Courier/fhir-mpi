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

  19 March 2019

*/

module.exports = function(args, finished) {

  /*
  var patientId;
  if (args.session.nhsNumber &&  args.session.nhsNumber !== '') {
    patientId = args.session.nhsNumber;
  }
  else if (args.session.chiNumber &&  args.session.chiNumber !== '') {
    patientId = args.session.chiNumber;
  }
  */
  var patientId = args.id;

  if (!patientId) {
    return finished({error: 'Patient Id was not defined'});
  }

  var patientIndex = this.db.use('PatientIndex', 'by_identifier', patientId);
  if (!patientIndex.exists) {
    return finished({
      error: 'The specified Patient Id does not exist',
      status: {
        code: 404
      }
    });
  }

  var id = patientIndex.firstChild.name;
  console.log('** id = ' + id);
  var fhir = this.db.use('Patient', 'by_id', id).getDocument(true);
  finished({patient: fhir});

};
