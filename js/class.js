import { fetchClass, fetchMembers, fetchProfile, getCurrentUser, fetchMember } from './login.js';

let classroom;
const className = document.getElementById('className');
const schoolName = document.getElementById('school');
const classCode = document.getElementById('code');

document.addEventListener('DOMContentLoaded', async () => {
    // Get the class ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const syntax = urlParams.get('syntax');
    console.log(syntax);
    
    if (syntax) {
        classroom = await fetchClass(syntax);
        if (classroom) {
            const currentUserlogged = await getCurrentUser();
            className.innerHTML = classroom.name;
            schoolName.innerHTML = classroom.school;
            classCode.innerHTML = `<i>${classroom.code}</i>`;
            const currentmember = await fetchMember(syntax,currentUserlogged.uid)
            const members = await fetchMembers(syntax);
            const memberList = document.getElementById('memberList');
            
            if (!memberList) {
                console.error('Element with ID "memberList" not found');
                return;
            }

            memberList.innerHTML = ''; // Clear existing content

            for (const member of members) {
                try {
                    const memberData = await fetchProfile(member.id);
                    console.log(memberData);
                    
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-item');
                    listItem.innerHTML = `
                        <div>
                            <h3>${memberData.displayName}</h3>
                            <p>School: ${memberData.school}</p>
                            <p><b>Role: ${member.role}</b></p>
                        </div>
                        ${currentmember.role === 'admin' ? '<button class="remove-btn">Remove</button>' : ''}
                    `;
                    memberList.appendChild(listItem);
                } catch (error) {
                    console.error(`Failed to fetch profile for member with ID ${member.id}:`, error);
                }
            }
        } else {
            console.error('Failed to fetch classroom');
        }
    } else {
        console.error('No syntax provided in URL');
    }
});