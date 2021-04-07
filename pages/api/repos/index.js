import getFirebaseAdmin from '../../../utils/firebaseadmin.js';
import { sendStatus, formatData } from '../../../utils/apiFormatter';

export default async function user(req, res) {
  if (req.method !== 'GET') return sendStatus(res, 'CannotMethod');

  const admin = await getFirebaseAdmin();
  var db = admin.firestore();
  const ref = db.collection('repos');

  const { limit } = req.query;
  const documents = await ref
    .orderBy('name')
    .limit(parseInt(limit, 10) || 10)
    .get();

  var repos = [];
  documents.forEach(doc => {
    var data = doc.data();
    var repoData = {
      full_name: data.full_name,
      url: data.url,
      issues: data.issues,
      stars: data.stars,
      language: data.language,
    };
    repos.push(repoData);
  });

  res.status(200).send(formatData(repos));
}