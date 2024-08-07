import { fetchClass, fetchMembers, fetchProfile, getCurrentUser, fetchMember, kickfromClass } from './login.js';

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
            const currentmember = await fetchMember(syntax, currentUserlogged.uid)
            const members = await fetchMembers(syntax);
            const memberList = document.getElementById('memberList');

            if (!currentmember) {
                window.location.href = `classes.html`;
            }

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
    ${currentmember.role === 'admin' && member.role !== 'admin' ? `<button data-typeId="${memberData.uid}" data-syntax="${syntax}"  class="remove-btn">Remove</button>` : ''}
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

document.getElementById('memberList').addEventListener('click', async function (event) {
    if (event.target.classList.contains('remove-btn')) {
        // Get the list item that contains the remove button
        var listItem = event.target.closest('li');
        var btn = event.target;
        // Get the unique syntax from the list item
        let syntax = btn.getAttribute('data-syntax');
    let id = btn.getAttribute('data-typeId');
    
        try {
            await kickfromClass(syntax,id);
            console.log("Class removed successfully:", syntax);
        } catch (error) {
            console.error("Error removing class:", syntax, id, error);
        }
        listItem.remove();
    }
});
